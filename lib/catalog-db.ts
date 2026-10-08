import {neon} from "@neondatabase/serverless";
import {catalogProducts,isPublicationReady,type CatalogProduct} from "../data/catalog";

type CommercialPatch=Partial<CatalogProduct["commercial"]>;
export type CatalogContentPatch=Partial<Pick<CatalogProduct,"name"|"brand"|"family"|"unit"|"publicDescription"|"publicSpecifications"|"certifications"|"imageUrl"|"imageUrls"|"datasheetUrl"|"sourceUrl"|"availability"|"delivery">>;
const numericKeys=["cost","inboundShipping","handling","contingencyPercent","targetMarginPercent","vatPercent"] as const;

export function sanitizeCommercialPatch(input:Record<string,unknown>):CommercialPatch{
  const patch:CommercialPatch={};
  for(const key of numericKeys){if(input[key]!==undefined){const value=Number(input[key]);if(!Number.isFinite(value)||value<0)throw new Error(`${key} no es válido`);patch[key]=value;}}
  if(patch.targetMarginPercent!==undefined&&patch.targetMarginPercent>=100)throw new Error("El margen objetivo debe ser menor de 100 %");
  if(patch.vatPercent!==undefined&&patch.vatPercent>100)throw new Error("El IVA no puede superar 100 %");
  if(patch.contingencyPercent!==undefined&&patch.contingencyPercent>100)throw new Error("La contingencia no puede superar 100 %");
  if(input.status!==undefined){if(!["draft","quote","ready"].includes(String(input.status)))throw new Error("Estado no válido");patch.status=input.status as CommercialPatch["status"];}
  if(input.costVerified!==undefined)patch.costVerified=Boolean(input.costVerified);
  return patch;
}

const textKeys=["name","brand","family","unit","publicDescription","availability","delivery"] as const;
function safeHttps(value:unknown){const text=String(value??"").trim();if(!text)return undefined;let url:URL;try{url=new URL(text);}catch{throw new Error("URL no válida");}if(url.protocol!=="https:")throw new Error("La URL debe usar HTTPS");return url.toString();}
export function sanitizeCatalogPatch(input:Record<string,unknown>):CatalogContentPatch{
 const patch:CatalogContentPatch={};
 for(const key of textKeys)if(input[key]!==undefined){const value=String(input[key]).trim();if(!value)throw new Error(`${key} no puede quedar vacío`);patch[key]=value;}
 for(const key of ["datasheetUrl","sourceUrl"] as const)if(input[key]!==undefined)patch[key]=safeHttps(input[key]);
 for(const key of ["publicSpecifications","certifications"] as const)if(input[key]!==undefined){if(!Array.isArray(input[key]))throw new Error(`${key} debe ser una lista`);patch[key]=(input[key] as unknown[]).map(String).map(value=>value.trim()).filter(Boolean).slice(0,40);}
 if(input.imageUrls!==undefined){if(!Array.isArray(input.imageUrls))throw new Error("imageUrls debe ser una lista");const urls=(input.imageUrls as unknown[]).map((value,index)=>{try{return safeHttps(value);}catch{throw new Error(`URL de imagen no válida en la línea ${index+1}`);}}).filter((value):value is string=>Boolean(value)).slice(0,12);if(!urls.length)throw new Error("Añade al menos una URL HTTPS de imagen");patch.imageUrls=[...new Set(urls)];patch.imageUrl=patch.imageUrls[0];}
 return patch;
}

export function validatePublicationTransition(product:CatalogProduct,patch:CommercialPatch){
 const candidate={...product,commercial:{...product.commercial,...patch}};
 if(candidate.commercial.status==="ready"&&!isPublicationReady(candidate))throw new Error("El expediente no está completo para publicar: verifica coste, imágenes, documento y comparativas");
}

function sql(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL no configurada");return neon(process.env.DATABASE_URL);}

export function isMissingCatalogSchemaError(error:unknown){return Boolean(error&&typeof error==="object"&&"code" in error&&(error as {code?:unknown}).code==="42P01");}

let schemaPromise:Promise<void>|null=null;
export async function ensureCatalogSchema(){schemaPromise??=(async()=>{const db=sql();
 await db`CREATE TABLE IF NOT EXISTS catalog_products (id text PRIMARY KEY, sku text UNIQUE NOT NULL, payload jsonb NOT NULL, commercial jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
 await db`CREATE TABLE IF NOT EXISTS catalog_suppliers (product_id text PRIMARY KEY REFERENCES catalog_products(id) ON DELETE CASCADE, name text NOT NULL, country text NOT NULL, reference text NOT NULL, source_url text NOT NULL)`;
 await db`CREATE TABLE IF NOT EXISTS catalog_images (product_id text REFERENCES catalog_products(id) ON DELETE CASCADE, position integer NOT NULL, url text NOT NULL, source text, PRIMARY KEY(product_id,position))`;
 await db`CREATE TABLE IF NOT EXISTS catalog_offers (product_id text REFERENCES catalog_products(id) ON DELETE CASCADE, seller text NOT NULL, sku text NOT NULL, price numeric(12,2) NOT NULL, vat_included boolean NOT NULL, shipping_included boolean NOT NULL, url text NOT NULL, captured_at date NOT NULL, country text NOT NULL, PRIMARY KEY(product_id,seller))`;
 await db`CREATE TABLE IF NOT EXISTS catalog_documents (product_id text REFERENCES catalog_products(id) ON DELETE CASCADE, kind text NOT NULL, url text NOT NULL, PRIMARY KEY(product_id,kind))`;
 await db`CREATE TABLE IF NOT EXISTS catalog_audit (id bigserial PRIMARY KEY, product_id text NOT NULL, actor_id text NOT NULL, patch jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
 await db`CREATE TABLE IF NOT EXISTS product_inquiries (id text PRIMARY KEY, kind text NOT NULL, product_id text, product_name text, customer_name text NOT NULL, company text, email text, phone text, message text NOT NULL, documents jsonb NOT NULL DEFAULT '[]'::jsonb, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now())`;
 await db`CREATE TABLE IF NOT EXISTS catalog_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
 })().catch(error=>{schemaPromise=null;throw error;});return schemaPromise;
}

export async function createProductInquiry(input:{id:string;kind:string;productId:string;productName:string;name:string;company:string;email:string;phone:string;message:string;documents:unknown[]}){const insert=()=>sql()`INSERT INTO product_inquiries(id,kind,product_id,product_name,customer_name,company,email,phone,message,documents) VALUES(${input.id},${input.kind},${input.productId||null},${input.productName||null},${input.name},${input.company||null},${input.email||null},${input.phone||null},${input.message},${JSON.stringify(input.documents)}::jsonb)`;try{await insert();}catch(error){await recoverMissingCatalogSchema(error);await insert();}}
export async function getProductInquiries(){const read=()=>sql()`SELECT id,kind,product_id,product_name,customer_name,company,email,phone,message,documents,status,created_at FROM product_inquiries ORDER BY created_at DESC LIMIT 200`;try{return await read();}catch(error){await recoverMissingCatalogSchema(error);return read();}}

async function applyCatalogMigrations(){const db=sql();const migration="2026-10-06-verified-products-v2";const applied=await db`SELECT id FROM catalog_migrations WHERE id=${migration}`;if(applied.length)return;
 for(const id of ["arnes-anticaidas","anticaidas-retractil","disco-diamante-230"])await db`UPDATE catalog_products SET commercial=commercial||'{"status":"ready","costVerified":true}'::jsonb,updated_at=now() WHERE id=${id}`;
 await db`INSERT INTO catalog_migrations(id) VALUES(${migration}) ON CONFLICT DO NOTHING`;
}

export async function seedCatalog(){await ensureCatalogSchema();const db=sql();
 const seedVersion="2026-10-07-catalog-editor-v4";
 const alreadySeeded=await db`SELECT id FROM catalog_migrations WHERE id=${seedVersion}`;
 if(!alreadySeeded.length){
  const productRows=catalogProducts.map(product=>({id:product.id,sku:product.sku,payload:product,commercial:product.commercial}));
  const supplierRows=catalogProducts.map(product=>({product_id:product.id,name:product.supplier.name,country:product.supplier.country,reference:product.supplier.reference,source_url:product.sourceUrl}));
  const imageRows=catalogProducts.flatMap(product=>(product.imageUrls?.length?product.imageUrls:product.imageUrl?[product.imageUrl]:[]).map((url,position)=>({product_id:product.id,position,url,source:product.imageSource??null})));
  const offerRows=catalogProducts.flatMap(product=>product.offers.map(offer=>({product_id:product.id,...offer,vat_included:offer.vatIncluded,shipping_included:offer.shippingIncluded,captured_at:offer.capturedAt})));
  const documentRows=catalogProducts.filter(product=>product.datasheetUrl).map(product=>({product_id:product.id,kind:"technical-sheet",url:product.datasheetUrl!}));
  await db`INSERT INTO catalog_products(id,sku,payload,commercial) SELECT id,sku,payload,commercial FROM jsonb_to_recordset(${JSON.stringify(productRows)}::jsonb) AS row(id text,sku text,payload jsonb,commercial jsonb) ON CONFLICT(id) DO UPDATE SET sku=EXCLUDED.sku,payload=EXCLUDED.payload||CASE WHEN catalog_products.payload ? 'adminContent' THEN jsonb_build_object('adminContent',catalog_products.payload->'adminContent') ELSE '{}'::jsonb END,updated_at=now()`;
  await db`INSERT INTO catalog_suppliers(product_id,name,country,reference,source_url) SELECT product_id,name,country,reference,source_url FROM jsonb_to_recordset(${JSON.stringify(supplierRows)}::jsonb) AS row(product_id text,name text,country text,reference text,source_url text) ON CONFLICT(product_id) DO UPDATE SET name=EXCLUDED.name,country=EXCLUDED.country,reference=EXCLUDED.reference,source_url=EXCLUDED.source_url`;
  if(imageRows.length)await db`INSERT INTO catalog_images(product_id,position,url,source) SELECT product_id,position,url,source FROM jsonb_to_recordset(${JSON.stringify(imageRows)}::jsonb) AS row(product_id text,position integer,url text,source text) ON CONFLICT(product_id,position) DO UPDATE SET url=EXCLUDED.url,source=EXCLUDED.source`;
  if(offerRows.length)await db`INSERT INTO catalog_offers(product_id,seller,sku,price,vat_included,shipping_included,url,captured_at,country) SELECT product_id,seller,sku,price,vat_included,shipping_included,url,captured_at,country FROM jsonb_to_recordset(${JSON.stringify(offerRows)}::jsonb) AS row(product_id text,seller text,sku text,price numeric,vat_included boolean,shipping_included boolean,url text,captured_at date,country text) ON CONFLICT(product_id,seller) DO UPDATE SET sku=EXCLUDED.sku,price=EXCLUDED.price,vat_included=EXCLUDED.vat_included,shipping_included=EXCLUDED.shipping_included,url=EXCLUDED.url,captured_at=EXCLUDED.captured_at,country=EXCLUDED.country`;
  if(documentRows.length)await db`INSERT INTO catalog_documents(product_id,kind,url) SELECT product_id,kind,url FROM jsonb_to_recordset(${JSON.stringify(documentRows)}::jsonb) AS row(product_id text,kind text,url text) ON CONFLICT(product_id,kind) DO UPDATE SET url=EXCLUDED.url`;
  await db`INSERT INTO catalog_migrations(id) VALUES(${seedVersion}) ON CONFLICT DO NOTHING`;
 }
 await applyCatalogMigrations();
}

export function mergeCatalogCommercial(rows:Array<{payload:CatalogProduct&{adminContent?:CatalogContentPatch};commercial:CatalogProduct["commercial"]}>){const byId=new Map(rows.map(row=>[row.payload.id,row]));return catalogProducts.map(product=>{const stored=byId.get(product.id);if(!stored)return product;const edited=stored.payload.adminContent??{};return {...product,...edited,id:product.id,sku:product.sku,imageVerification:edited.imageUrls?undefined:product.imageVerification,commercial:stored.commercial};});}

let seedPromise:Promise<void>|null=null;
async function readCatalogRows(){return sql()`SELECT payload,commercial FROM catalog_products ORDER BY sku`;}
async function recoverMissingCatalogSchema(error:unknown){if(!isMissingCatalogSchemaError(error))throw error;seedPromise??=seedCatalog().catch(cause=>{seedPromise=null;throw cause;});await seedPromise;}
export async function getCatalog():Promise<CatalogProduct[]>{let rows;try{rows=await readCatalogRows();}catch(error){await recoverMissingCatalogSchema(error);rows=await readCatalogRows();}return mergeCatalogCommercial(rows as Array<{payload:CatalogProduct;commercial:CatalogProduct["commercial"]}>);}

export async function updateCatalogProducts(ids:string[],input:{commercial?:Record<string,unknown>;content?:Record<string,unknown>},actorId:string){
 const unique=[...new Set(ids.map(String).filter(Boolean))];if(!unique.length)throw new Error("Selecciona al menos un producto");
 const commercial=sanitizeCommercialPatch(input.commercial??{});const content=sanitizeCatalogPatch(input.content??{});if(content.imageUrls)commercial.status="draft";const db=sql();const updated:CatalogProduct[]=[];
 const targets=[];for(const id of unique){const current=await db`SELECT payload,commercial FROM catalog_products WHERE id=${id}`;if(!current.length)throw new Error(`Producto no encontrado: ${id}`);const stored=current[0].payload as CatalogProduct&{adminContent?:CatalogContentPatch};const product={...stored,...(stored.adminContent??{}),commercial:current[0].commercial} as CatalogProduct;validatePublicationTransition({...product,...content},commercial);targets.push({id,stored});}
 const prepared=targets.map(({id,stored})=>({id,stored,adminContent:{...(stored.adminContent??{}),...content}}));
 await db.transaction(tx=>prepared.flatMap(({id,adminContent})=>{
  const queries=[tx`UPDATE catalog_products SET payload=jsonb_set(payload,'{adminContent}',${JSON.stringify(adminContent)}::jsonb,true),commercial=commercial||${JSON.stringify(commercial)}::jsonb,updated_at=now() WHERE id=${id}`,tx`INSERT INTO catalog_audit(product_id,actor_id,patch) VALUES(${id},${actorId},${JSON.stringify({content,commercial})}::jsonb)`];
  if(content.imageUrls){queries.push(tx`DELETE FROM catalog_images WHERE product_id=${id}`);queries.push(tx`INSERT INTO catalog_images(product_id,position,url,source) SELECT ${id},position,url,'Edición administrativa' FROM jsonb_to_recordset(${JSON.stringify(content.imageUrls.map((url,position)=>({position,url})))}::jsonb) AS row(position integer,url text)`);}
  if(content.datasheetUrl)queries.push(tx`INSERT INTO catalog_documents(product_id,kind,url) VALUES(${id},'technical-sheet',${content.datasheetUrl}) ON CONFLICT(product_id,kind) DO UPDATE SET url=EXCLUDED.url`);
  if(content.sourceUrl)queries.push(tx`UPDATE catalog_suppliers SET source_url=${content.sourceUrl} WHERE product_id=${id}`);
  return queries;
 }));
 for(const {stored,adminContent} of prepared)updated.push({...stored,...adminContent,imageVerification:content.imageUrls?undefined:stored.imageVerification,commercial:{...stored.commercial,...commercial}} as CatalogProduct);
 return updated;
}

export async function updateCommercial(id:string,input:Record<string,unknown>,actorId:string){return (await updateCatalogProducts([id],{commercial:input},actorId))[0];}
