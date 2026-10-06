import {neon} from "@neondatabase/serverless";
import {catalogProducts,type CatalogProduct} from "../data/catalog";

type CommercialPatch=Partial<CatalogProduct["commercial"]>;
const numericKeys=["cost","inboundShipping","handling","contingencyPercent","targetMarginPercent","vatPercent"] as const;

export function sanitizeCommercialPatch(input:Record<string,unknown>):CommercialPatch{
  const patch:CommercialPatch={};
  for(const key of numericKeys){if(input[key]!==undefined){const value=Number(input[key]);if(!Number.isFinite(value)||value<0)throw new Error(`${key} no es válido`);patch[key]=value;}}
  if(input.status!==undefined){if(!["draft","quote","ready"].includes(String(input.status)))throw new Error("Estado no válido");patch.status=input.status as CommercialPatch["status"];}
  if(input.costVerified!==undefined)patch.costVerified=Boolean(input.costVerified);
  return patch;
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

async function applyCatalogMigrations(){const db=sql();const migration="2026-10-06-verified-products-v1";const applied=await db`SELECT id FROM catalog_migrations WHERE id=${migration}`;if(applied.length)return;
 for(const id of ["arnes-anticaidas","anticaidas-retractil","disco-diamante-230"]){const product=catalogProducts.find(item=>item.id===id);if(product)await db`UPDATE catalog_products SET commercial=${JSON.stringify(product.commercial)}::jsonb,updated_at=now() WHERE id=${id}`;}
 await db`INSERT INTO catalog_migrations(id) VALUES(${migration}) ON CONFLICT DO NOTHING`;
}

export async function seedCatalog(){await ensureCatalogSchema();const db=sql();
 for(const product of catalogProducts){
  await db`INSERT INTO catalog_products(id,sku,payload,commercial) VALUES(${product.id},${product.sku},${JSON.stringify(product)}::jsonb,${JSON.stringify(product.commercial)}::jsonb) ON CONFLICT(id) DO UPDATE SET sku=EXCLUDED.sku,payload=EXCLUDED.payload,updated_at=now()`;
  await db`INSERT INTO catalog_suppliers(product_id,name,country,reference,source_url) VALUES(${product.id},${product.supplier.name},${product.supplier.country},${product.supplier.reference},${product.sourceUrl}) ON CONFLICT(product_id) DO UPDATE SET name=EXCLUDED.name,country=EXCLUDED.country,reference=EXCLUDED.reference,source_url=EXCLUDED.source_url`;
  const images=product.imageUrls?.length?product.imageUrls:product.imageUrl?[product.imageUrl]:[];
  for(let i=0;i<images.length;i++)await db`INSERT INTO catalog_images(product_id,position,url,source) VALUES(${product.id},${i},${images[i]},${product.imageSource??null}) ON CONFLICT(product_id,position) DO UPDATE SET url=EXCLUDED.url,source=EXCLUDED.source`;
  for(const offer of product.offers)await db`INSERT INTO catalog_offers(product_id,seller,sku,price,vat_included,shipping_included,url,captured_at,country) VALUES(${product.id},${offer.seller},${offer.sku},${offer.price},${offer.vatIncluded},${offer.shippingIncluded},${offer.url},${offer.capturedAt},${offer.country}) ON CONFLICT(product_id,seller) DO UPDATE SET sku=EXCLUDED.sku,price=EXCLUDED.price,vat_included=EXCLUDED.vat_included,shipping_included=EXCLUDED.shipping_included,url=EXCLUDED.url,captured_at=EXCLUDED.captured_at,country=EXCLUDED.country`;
  if(product.datasheetUrl)await db`INSERT INTO catalog_documents(product_id,kind,url) VALUES(${product.id},'technical-sheet',${product.datasheetUrl}) ON CONFLICT(product_id,kind) DO UPDATE SET url=EXCLUDED.url`;
 }
 await applyCatalogMigrations();
}

export async function getCatalog():Promise<CatalogProduct[]>{await seedCatalog();const rows=await sql()`SELECT payload,commercial FROM catalog_products ORDER BY sku`;return rows.map(row=>({...row.payload,commercial:row.commercial})) as CatalogProduct[];}

export async function updateCommercial(id:string,input:Record<string,unknown>,actorId:string){const patch=sanitizeCommercialPatch(input);const db=sql();const rows=await db`UPDATE catalog_products SET commercial=commercial||${JSON.stringify(patch)}::jsonb,updated_at=now() WHERE id=${id} RETURNING payload,commercial`;if(!rows.length)throw new Error("Producto no encontrado");await db`INSERT INTO catalog_audit(product_id,actor_id,patch) VALUES(${id},${actorId},${JSON.stringify(patch)}::jsonb)`;return {...rows[0].payload,commercial:rows[0].commercial} as CatalogProduct;}
