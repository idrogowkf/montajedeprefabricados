import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";
import {isAllowedInquiryStatus,normalizeCustomerEmail,profileRowToCustomerProfile} from "./customer-account-db";

const source=()=>readFileSync(join(process.cwd(),"lib/customer-account-db.ts"),"utf8");

describe("customer account schema",()=>{
  it("declares an idempotent customer profile and inquiry ownership migration",()=>{
    const code=source();
    expect(code).toContain("CREATE TABLE IF NOT EXISTS customer_profiles");
    for(const column of ["user_id","profile_snapshot","public_status","admin_notes","updated_at"]){
      expect(code).toContain(`ADD COLUMN IF NOT EXISTS ${column}`);
    }
    expect(code).toContain("CREATE INDEX IF NOT EXISTS product_inquiries_user_id_idx");
    expect(code).toContain("CREATE INDEX IF NOT EXISTS customer_profiles_email_idx");
  });

  it("scopes customer reads and historical linking to safe ownership rules",()=>{
    const code=source();
    expect(code).toMatch(/FROM product_inquiries WHERE user_id=\$\{userId\}/);
    expect(code).toMatch(/WHERE user_id IS NULL AND lower\(email\)=ANY\(/);
    expect(code).not.toMatch(/WHERE (customer_name|phone)=/);
  });
});

describe("customer account persistence helpers",()=>{
  it("normalizes emails and accepts only public statuses",()=>{
    expect(normalizeCustomerEmail("  USER@Example.COM ")).toBe("user@example.com");
    expect(isAllowedInquiryStatus("quoted")).toBe(true);
    expect(isAllowedInquiryStatus("internal_review")).toBe(false);
  });

  it("maps snake-case profile rows without leaking deletion state",()=>{
    expect(profileRowToCustomerProfile({
      user_id:"user_1",email:"user@example.com",customer_type:"individual",contact_name:"Ana García",
      legal_name:null,tax_id_type:"nif",tax_id:"12345678Z",phone:"612345678",address_line1:"Calle Mayor 12",
      address_line2:null,postal_code:"28013",city:"Madrid",province:"Madrid",country_code:"ES",
      privacy_accepted_at:"2026-10-15T10:00:00.000Z",created_at:"2026-10-15T10:00:00.000Z",updated_at:"2026-10-15T10:00:00.000Z",
    })).toMatchObject({userId:"user_1",email:"user@example.com",customerType:"individual",legalName:"",addressLine2:""});
  });
  it("anonymizes personal data while preserving the commercial record",()=>{const code=source();for(const value of ["customer_name='Cuenta eliminada'","email=NULL","phone=NULL","documents='[]'::jsonb","profile_snapshot='{}'::jsonb"])expect(code).toContain(value);expect(code).not.toContain("DELETE FROM product_inquiries");expect(code).toContain("requestCustomerAccountDeletion");});
});
