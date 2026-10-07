import {neon} from "@neondatabase/serverless";
import {catalogProducts,isPublicationReady,type CatalogProduct} from "../data/catalog";

type CommercialPatch=Partial<CatalogProduct["commercial"]>;
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

export function validatePublicationTransition(product:CatalogProduct,patch:CommercialPatch){
 const candidate={...product,commercial:{...product.commercial,...patch}};
 if(candidate.commercial.status==="ready"&&!isPublicationReady(candidate))throw new Error("El expediente no está completo para publicar: verifica coste, imágenes, documento y comparativas");
}

function sql(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL no configurada");return neon(process.env.DATABASE_URL);}

export async function ensureCatalogSchema(){const db=sql();
 await db`CREATE TABLE IF NOT EXISTS catalog_products (id text PRIMARY KEY, sku text UNIQUE NOT NULL, payload jsonb NOT NULL, commercial jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
 await db`CREATE TABLE IF NOT EXISTS catalog_suppliers (product_id text PRIMARY KEY REFERENCES catalog_products(id) ON DELETE CASCADE, name text NOT NULL, country text NOT NULL, reference text NOT NULL, source_url text NOT NULL)`;
 await db`CREATE TABLE IF NOT EXISTS catalog_images (product_id text REFERENCES catalog_products(id) ON DELETE CASCADE, position integer NOT NULL, url text NOT NULL, source text, PRIMARY KEY(product_id,position))`;
 await db`CREATE TABLE IF NOT EXISTS catalog_offers (product_id text REFERENCES catalog_products(id) ON DELETE CASCADE, seller text NOT NULL, sku text NOT NULL, price numeric(12,2) NOT NULL, vat_included boolean NOT NULL, shipping_included boolean NOT NULL, url text NOT NULL, captured_at date NOT NULL, country text NOT NULL, PRIMARY KEY(product_id,seller))`;
 await db`CREATE TABLE IF NOT EXISTS catalog_documents (product_id text REFERENCES catalog_products(id) ON DELETE CASCADE, kind text NOT NULL, url text NOT NULL, PRIMARY KEY(product_id,kind))`;
 await db`CREATE TABLE IF NOT EXISTS catalog_audit (id bigserial PRIMARY KEY, product_id text NOT NULL, actor_id text NOT NULL, patch jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
 await db`CREATE TABLE IF NOT EXISTS catalog_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
}

async function applyCatalogMigrations(){const db=sql();const migration="2026-10-06-verified-products-v2";const applied=await db`SELECT id FROM catalog_migrations WHERE id=${migration}`;if(applied.length)return;
 for(const id of ["arnes-anticaidas","anticaidas-retractil","disco-diamante-230"])await db`UPDATE catalog_products SET commercial=commercial||'{"status":"ready","costVerified":true}'::jsonb,updated_at=now() WHERE id=${id}`;
 await db`INSERT INTO catalog_migrations(id) VALUES(${migration}) ON CONFLICT DO NOTHING`;
}

export async function seedCatalog(){await ensureCatalogSchema();const db=sql();
 const seedVersion="2026-10-07-catalog-expansion-129-v2";
 const alreadySeeded=await db`SELECT id FROM catalog_migrations WHERE id=${seedVersion}`;
 if(!alreadySeeded.length){
  const productRows=catalogProducts.map(product=>({id:product.id,sku:product.sku,payload:product,commercial:product.commercial}));
  const supplierRows=catalogProducts.map(product=>({product_id:product.id,name:product.supplier.name,country:product.supplier.country,reference:product.supplier.reference,source_url:product.sourceUrl}));
  const imageRows=catalogProducts.flatMap(product=>(product.imageUrls?.length?product.imageUrls:product.imageUrl?[product.imageUrl]:[]).map((url,position)=>({product_id:product.id,position,url,source:product.imageSource??null})));
  const offerRows=catalogProducts.flatMap(product=>product.offers.map(offer=>({product_id:product.id,...offer,vat_included:offer.vatIncluded,shipping_included:offer.shippingIncluded,captured_at:offer.capturedAt})));
  const documentRows=catalogProducts.filter(product=>product.datasheetUrl).map(product=>({product_id:product.id,kind:"technical-sheet",url:product.datasheetUrl!}));
  await db`INSERT INTO catalog_products(id,sku,payload,commercial) SELECT id,sku,payload,commercial FROM jsonb_to_recordset(${JSON.stringify(productRows)}::jsonb) AS row(id text,sku text,payload jsonb,commercial jsonb) ON CONFLICT(id) DO UPDATE SET sku=EXCLUDED.sku,payload=EXCLUDED.payload,updated_at=now()`;
  await db`INSERT INTO catalog_suppliers(product_id,name,country,reference,source_url) SELECT product_id,name,country,reference,source_url FROM jsonb_to_recordset(${JSON.stringify(supplierRows)}::jsonb) AS row(product_id text,name text,country text,reference text,source_url text) ON CONFLICT(product_id) DO UPDATE SET name=EXCLUDED.name,country=EXCLUDED.country,reference=EXCLUDED.reference,source_url=EXCLUDED.source_url`;
  if(imageRows.length)await db`INSERT INTO catalog_images(product_id,position,url,source) SELECT product_id,position,url,source FROM jsonb_to_recordset(${JSON.stringify(imageRows)}::jsonb) AS row(product_id text,position integer,url text,source text) ON CONFLICT(product_id,position) DO UPDATE SET url=EXCLUDED.url,source=EXCLUDED.source`;
  if(offerRows.length)await db`INSERT INTO catalog_offers(product_id,seller,sku,price,vat_included,shipping_included,url,captured_at,country) SELECT product_id,seller,sku,price,vat_included,shipping_included,url,captured_at,country FROM jsonb_to_recordset(${JSON.stringify(offerRows)}::jsonb) AS row(product_id text,seller text,sku text,price numeric,vat_included boolean,shipping_included boolean,url text,captured_at date,country text) ON CONFLICT(product_id,seller) DO UPDATE SET sku=EXCLUDED.sku,price=EXCLUDED.price,vat_included=EXCLUDED.vat_included,shipping_included=EXCLUDED.shipping_included,url=EXCLUDED.url,captured_at=EXCLUDED.captured_at,country=EXCLUDED.country`;
  if(documentRows.length)await db`INSERT INTO catalog_documents(product_id,kind,url) SELECT product_id,kind,url FROM jsonb_to_recordset(${JSON.stringify(documentRows)}::jsonb) AS row(product_id text,kind text,url text) ON CONFLICT(product_id,kind) DO UPDATE SET url=EXCLUDED.url`;
  await db`INSERT INTO catalog_migrations(id) VALUES(${seedVersion}) ON CONFLICT DO NOTHING`;
 }
 await applyCatalogMigrations();
}

export function mergeCatalogCommercial(rows:Array<{payload:CatalogProduct;commercial:CatalogProduct["commercial"]}>){const byId=new Map(rows.map(row=>[row.payload.id,row.commercial]));return catalogProducts.map(product=>{const stored=byId.get(product.id);return {...product,commercial:stored??product.commercial};});}

let seedPromise:Promise<void>|null=null;
export async function getCatalog():Promise<CatalogProduct[]>{seedPromise??=seedCatalog().catch(error=>{seedPromise=null;throw error;});await seedPromise;const rows=await sql()`SELECT payload,commercial FROM catalog_products ORDER BY sku`;return mergeCatalogCommercial(rows as Array<{payload:CatalogProduct;commercial:CatalogProduct["commercial"]}>);}

export async function updateCommercial(id:string,input:Record<string,unknown>,actorId:string){const patch=sanitizeCommercialPatch(input);const db=sql();const current=await db`SELECT payload,commercial FROM catalog_products WHERE id=${id}`;if(!current.length)throw new Error("Producto no encontrado");const staticProduct=catalogProducts.find(product=>product.id===id);if(!staticProduct)throw new Error("Producto no encontrado");const product={...staticProduct,commercial:current[0].commercial} as CatalogProduct;validatePublicationTransition(product,patch);const rows=await db`UPDATE catalog_products SET commercial=commercial||${JSON.stringify(patch)}::jsonb,updated_at=now() WHERE id=${id} RETURNING commercial`;await db`INSERT INTO catalog_audit(product_id,actor_id,patch) VALUES(${id},${actorId},${JSON.stringify(patch)}::jsonb)`;return {...staticProduct,commercial:rows[0].commercial} as CatalogProduct;}
