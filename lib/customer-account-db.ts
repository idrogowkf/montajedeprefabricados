import {neon} from "@neondatabase/serverless";
import {ensureCatalogSchema} from "./catalog-db";
import {normalizeTaxId,type CustomerProfile,type CustomerProfileInput,type PublicInquiryStatus} from "./customer-account";

const publicStatuses=new Set<PublicInquiryStatus>(["received","reviewing","awaiting_customer","quoted","closed"]);
export function isAllowedInquiryStatus(value:string):value is PublicInquiryStatus{return publicStatuses.has(value as PublicInquiryStatus);}
export function normalizeCustomerEmail(value:string){return String(value??"").trim().toLowerCase();}

function sql(){if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL no configurada");return neon(process.env.DATABASE_URL);}

type ProfileRow={
  user_id:string;email:string;customer_type:CustomerProfile["customerType"];contact_name:string;legal_name:string|null;
  tax_id_type:CustomerProfile["taxIdType"];tax_id:string;phone:string;address_line1:string;address_line2:string|null;
  postal_code:string;city:string;province:string;country_code:string;privacy_accepted_at:string|Date;
  created_at:string|Date;updated_at:string|Date;
};

export function profileRowToCustomerProfile(row:ProfileRow):CustomerProfile{return {
  userId:row.user_id,email:row.email,customerType:row.customer_type,contactName:row.contact_name,legalName:row.legal_name??"",
  taxIdType:row.tax_id_type,taxId:row.tax_id,phone:row.phone,addressLine1:row.address_line1,addressLine2:row.address_line2??"",
  postalCode:row.postal_code,city:row.city,province:row.province,countryCode:row.country_code,privacyAccepted:true,
  privacyAcceptedAt:new Date(row.privacy_accepted_at).toISOString(),createdAt:new Date(row.created_at).toISOString(),updatedAt:new Date(row.updated_at).toISOString(),
};}

let schemaPromise:Promise<void>|null=null;
export async function ensureCustomerAccountSchema(){schemaPromise??=(async()=>{
  await ensureCatalogSchema();
  const db=sql();
  await db`CREATE TABLE IF NOT EXISTS customer_profiles (
    user_id text PRIMARY KEY,
    email text NOT NULL,
    customer_type text NOT NULL,
    contact_name text NOT NULL,
    legal_name text,
    tax_id_type text NOT NULL,
    tax_id text NOT NULL,
    phone text NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    postal_code text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    country_code text NOT NULL DEFAULT 'ES',
    privacy_accepted_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz
  )`;
  await db`ALTER TABLE product_inquiries ADD COLUMN IF NOT EXISTS user_id text`;
  await db`ALTER TABLE product_inquiries ADD COLUMN IF NOT EXISTS profile_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb`;
  await db`ALTER TABLE product_inquiries ADD COLUMN IF NOT EXISTS public_status text NOT NULL DEFAULT 'received'`;
  await db`ALTER TABLE product_inquiries ADD COLUMN IF NOT EXISTS admin_notes text`;
  await db`ALTER TABLE product_inquiries ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()`;
  await db`CREATE INDEX IF NOT EXISTS customer_profiles_email_idx ON customer_profiles(lower(email)) WHERE deleted_at IS NULL`;
  await db`CREATE INDEX IF NOT EXISTS product_inquiries_user_id_idx ON product_inquiries(user_id,created_at DESC)`;
  await db`CREATE TABLE IF NOT EXISTS product_inquiry_status_audit (
    id bigserial PRIMARY KEY,inquiry_id text NOT NULL,actor_id text NOT NULL,public_status text NOT NULL,
    admin_notes text,created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS customer_account_deletions (
    user_id text PRIMARY KEY,requested_at timestamptz NOT NULL DEFAULT now(),completed_at timestamptz
  )`;
})().catch(error=>{schemaPromise=null;throw error;});return schemaPromise;}

export async function getCustomerProfile(userId:string){await ensureCustomerAccountSchema();const rows=await sql()`SELECT * FROM customer_profiles WHERE user_id=${userId} AND deleted_at IS NULL LIMIT 1`;return rows.length?profileRowToCustomerProfile(rows[0] as ProfileRow):null;}

export async function upsertCustomerProfile(userId:string,email:string,input:CustomerProfileInput){
  await ensureCustomerAccountSchema();const db=sql();const normalizedEmail=normalizeCustomerEmail(email),taxId=normalizeTaxId(input.taxId),country=input.countryCode.trim().toUpperCase();
  const rows=await db`INSERT INTO customer_profiles(user_id,email,customer_type,contact_name,legal_name,tax_id_type,tax_id,phone,address_line1,address_line2,postal_code,city,province,country_code,privacy_accepted_at)
    VALUES(${userId},${normalizedEmail},${input.customerType},${input.contactName.trim()},${input.legalName.trim()||null},${input.taxIdType},${taxId},${input.phone.trim()},${input.addressLine1.trim()},${input.addressLine2.trim()||null},${input.postalCode.trim()},${input.city.trim()},${input.province.trim()},${country},now())
    ON CONFLICT(user_id) DO UPDATE SET email=EXCLUDED.email,customer_type=EXCLUDED.customer_type,contact_name=EXCLUDED.contact_name,legal_name=EXCLUDED.legal_name,tax_id_type=EXCLUDED.tax_id_type,tax_id=EXCLUDED.tax_id,phone=EXCLUDED.phone,address_line1=EXCLUDED.address_line1,address_line2=EXCLUDED.address_line2,postal_code=EXCLUDED.postal_code,city=EXCLUDED.city,province=EXCLUDED.province,country_code=EXCLUDED.country_code,privacy_accepted_at=CASE WHEN customer_profiles.privacy_accepted_at IS NULL THEN now() ELSE customer_profiles.privacy_accepted_at END,updated_at=now(),deleted_at=NULL RETURNING *`;
  return profileRowToCustomerProfile(rows[0] as ProfileRow);
}

export async function linkHistoricalInquiries(userId:string,verifiedEmails:string[]){
  await ensureCustomerAccountSchema();const emails=[...new Set(verifiedEmails.map(normalizeCustomerEmail).filter(Boolean))];if(!emails.length)return 0;
  const rows=await sql()`UPDATE product_inquiries SET user_id=${userId},updated_at=now() WHERE user_id IS NULL AND lower(email)=ANY(${emails}) RETURNING id`;
  return rows.length;
}

export async function getCustomerInquiries(userId:string){await ensureCustomerAccountSchema();return sql()`SELECT id,kind,product_id,product_name,message,documents,public_status,created_at,updated_at FROM product_inquiries WHERE user_id=${userId} ORDER BY created_at DESC`;}

export async function getCustomerInquirySummary(userId:string){await ensureCustomerAccountSchema();const rows=await sql()`SELECT count(*)::int AS total,count(*) FILTER (WHERE public_status<>'closed')::int AS active FROM product_inquiries WHERE user_id=${userId}`;return {total:Number(rows[0]?.total??0),active:Number(rows[0]?.active??0)};}

export async function updateInquiryStatus(id:string,status:PublicInquiryStatus,adminNotes:string,actorId:string){
  if(!isAllowedInquiryStatus(status))throw new Error("Estado de solicitud no válido");await ensureCustomerAccountSchema();const db=sql();
  const queries=[db`UPDATE product_inquiries SET public_status=${status},admin_notes=${adminNotes.trim()||null},updated_at=now() WHERE id=${id} RETURNING id,kind,product_id,product_name,customer_name,company,email,phone,message,documents,status,public_status,admin_notes,profile_snapshot,created_at,updated_at`,db`INSERT INTO product_inquiry_status_audit(inquiry_id,actor_id,public_status,admin_notes) VALUES(${id},${actorId},${status},${adminNotes.trim()||null})`];
  const [updated]=await db.transaction(queries);if(!updated.length)throw new Error("Solicitud no encontrada");return updated[0];
}

export async function anonymizeCustomerAccount(userId:string){
  await ensureCustomerAccountSchema();const db=sql();
  await db.transaction([
    db`INSERT INTO customer_account_deletions(user_id) VALUES(${userId}) ON CONFLICT(user_id) DO NOTHING`,
    db`UPDATE product_inquiries SET user_id=NULL,customer_name='Cuenta eliminada',company=NULL,email=NULL,phone=NULL,documents='[]'::jsonb,profile_snapshot='{}'::jsonb,updated_at=now() WHERE user_id=${userId}`,
    db`UPDATE customer_profiles SET email=${`deleted-${userId}@invalid.local`},contact_name='Cuenta eliminada',legal_name=NULL,tax_id='',phone='',address_line1='',address_line2=NULL,postal_code='',city='',province='',deleted_at=now(),updated_at=now() WHERE user_id=${userId}`,
    db`UPDATE customer_account_deletions SET completed_at=now() WHERE user_id=${userId}`,
  ]);
}

export async function requestCustomerAccountDeletion(userId:string){await ensureCustomerAccountSchema();await sql()`INSERT INTO customer_account_deletions(user_id) VALUES(${userId}) ON CONFLICT(user_id) DO NOTHING`;}
export async function hasCompletedAccountDeletion(userId:string){await ensureCustomerAccountSchema();const rows=await sql()`SELECT completed_at FROM customer_account_deletions WHERE user_id=${userId}`;return Boolean(rows[0]?.completed_at);}
