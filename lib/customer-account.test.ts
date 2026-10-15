import {describe,expect,it} from "vitest";
import {
  isValidSpanishTaxId,
  normalizeTaxId,
  profileCompletion,
  publicInquiryStatus,
  validateCustomerProfile,
  type CustomerProfileInput,
} from "./customer-account";

const base:CustomerProfileInput={
  customerType:"individual",
  contactName:"Ana García López",
  legalName:"",
  taxIdType:"nif",
  taxId:"12345678Z",
  phone:"+34 612 345 678",
  addressLine1:"Calle Mayor 12",
  addressLine2:"",
  postalCode:"28013",
  city:"Madrid",
  province:"Madrid",
  countryCode:"ES",
  privacyAccepted:true,
};

describe("customer profile validation",()=>{
  it("accepts complete individual, self-employed and company profiles",()=>{
    expect(validateCustomerProfile(base)).toEqual({});
    expect(validateCustomerProfile({...base,customerType:"self_employed"})).toEqual({});
    expect(validateCustomerProfile({...base,customerType:"company",legalName:"Prefabricados Norte SL",taxIdType:"company_nif",taxId:"B12345674"})).toEqual({});
  });

  it("validates Spanish NIF and NIE control characters",()=>{
    expect(isValidSpanishTaxId("nif","12345678Z")).toBe(true);
    expect(isValidSpanishTaxId("nif","12345678A")).toBe(false);
    expect(isValidSpanishTaxId("nie","X1234567L")).toBe(true);
    expect(isValidSpanishTaxId("nie","X1234567A")).toBe(false);
    expect(isValidSpanishTaxId("company_nif","B12345674")).toBe(true);
    expect(isValidSpanishTaxId("company_nif","B12345670")).toBe(false);
  });

  it("requires a legal name only for a company",()=>{
    expect(validateCustomerProfile({...base,customerType:"company",legalName:"",taxIdType:"company_nif",taxId:"B12345674"})).toMatchObject({legalName:"Indica la razón social."});
    expect(validateCustomerProfile({...base,legalName:""})).not.toHaveProperty("legalName");
  });

  it("normalizes tax identifiers before validation",()=>{
    expect(normalizeTaxId(" b-12 345 674 ")).toBe("B12345674");
    expect(validateCustomerProfile({...base,customerType:"company",legalName:"Prefabricados Norte SL",taxIdType:"company_nif",taxId:" b-12 345 674 "})).toEqual({});
  });

  it("returns deterministic missing fields for an incomplete profile",()=>{
    const completion=profileCompletion({...base,contactName:"",phone:"",postalCode:"",privacyAccepted:false});
    expect(completion.complete).toBe(false);
    expect(completion.missing).toEqual(["contactName","phone","postalCode","privacyAccepted"]);
  });
});

describe("public inquiry statuses",()=>{
  it("maps every supported status to customer-facing Spanish",()=>{
    expect(publicInquiryStatus("received")).toBe("Recibida");
    expect(publicInquiryStatus("reviewing")).toBe("En revisión");
    expect(publicInquiryStatus("awaiting_customer")).toBe("Información pendiente");
    expect(publicInquiryStatus("quoted")).toBe("Oferta preparada");
    expect(publicInquiryStatus("closed")).toBe("Cerrada");
  });

  it("falls back safely for an unknown stored value",()=>{
    expect(publicInquiryStatus("unexpected")).toBe("Recibida");
  });
});
