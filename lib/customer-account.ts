export type CustomerType="individual"|"self_employed"|"company";
export type TaxIdType="nif"|"nie"|"company_nif"|"eu_vat"|"other";
export type PublicInquiryStatus="received"|"reviewing"|"awaiting_customer"|"quoted"|"closed";

export type CustomerProfileInput={
  customerType:CustomerType;
  contactName:string;
  legalName:string;
  taxIdType:TaxIdType;
  taxId:string;
  phone:string;
  addressLine1:string;
  addressLine2:string;
  postalCode:string;
  city:string;
  province:string;
  countryCode:string;
  privacyAccepted:boolean;
};

export type CustomerProfile=CustomerProfileInput&{
  userId:string;
  email:string;
  privacyAcceptedAt:string;
  createdAt:string;
  updatedAt:string;
};

export type ProfileCompletion={complete:boolean;missing:Array<keyof CustomerProfileInput>};

const NIF_LETTERS="TRWAGMYFPDXBNJZSQVHLCKE";
const profileFieldOrder:Array<keyof CustomerProfileInput>=[
  "customerType","contactName","legalName","taxIdType","taxId","phone",
  "addressLine1","postalCode","city","province","countryCode","privacyAccepted",
];

export function normalizeTaxId(value:string){return String(value??"").toUpperCase().replace(/[\s-]/g,"");}

function validCompanyNif(value:string){
  if(!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(value))return false;
  const digits=value.slice(1,8).split("").map(Number);
  const even=digits[1]+digits[3]+digits[5];
  const odd=digits.filter((_,index)=>index%2===0).reduce((sum,digit)=>{const doubled=digit*2;return sum+Math.floor(doubled/10)+(doubled%10);},0);
  const control=(10-((even+odd)%10))%10;
  const expectedLetter="JABCDEFGHI"[control];
  const actual=value.at(-1)!;
  if("PQRSNW".includes(value[0]))return actual===expectedLetter;
  if("ABEH".includes(value[0]))return actual===String(control);
  return actual===String(control)||actual===expectedLetter;
}

export function isValidSpanishTaxId(type:TaxIdType,value:string){
  const normalized=normalizeTaxId(value);
  if(type==="nif"){
    const match=normalized.match(/^(\d{8})([A-Z])$/);
    return Boolean(match&&NIF_LETTERS[Number(match[1])%23]===match[2]);
  }
  if(type==="nie"){
    const match=normalized.match(/^([XYZ])(\d{7})([A-Z])$/);
    if(!match)return false;
    const prefix={X:"0",Y:"1",Z:"2"}[match[1] as "X"|"Y"|"Z"];
    return NIF_LETTERS[Number(`${prefix}${match[2]}`)%23]===match[3];
  }
  if(type==="company_nif")return validCompanyNif(normalized);
  if(type==="eu_vat")return /^[A-Z]{2}[A-Z0-9]{2,12}$/.test(normalized);
  return /^[A-Z0-9]{4,20}$/.test(normalized);
}

export function validateCustomerProfile(input:CustomerProfileInput){
  const errors:Partial<Record<keyof CustomerProfileInput,string>>={};
  if(!["individual","self_employed","company"].includes(input.customerType))errors.customerType="Selecciona el tipo de cliente.";
  if(!input.contactName?.trim())errors.contactName="Indica el nombre y apellidos.";
  if(input.customerType==="company"&&!input.legalName?.trim())errors.legalName="Indica la razón social.";
  if(!["nif","nie","company_nif","eu_vat","other"].includes(input.taxIdType))errors.taxIdType="Selecciona el tipo de identificación fiscal.";
  else if(!isValidSpanishTaxId(input.taxIdType,input.taxId))errors.taxId="Revisa la identificación fiscal.";
  if(!input.phone?.trim()||input.phone.replace(/\D/g,"").length<7)errors.phone="Indica un teléfono válido.";
  if(!input.addressLine1?.trim())errors.addressLine1="Indica la dirección fiscal.";
  if(!input.postalCode?.trim()||(input.countryCode==="ES"&&!/^\d{5}$/.test(input.postalCode.trim())))errors.postalCode="Indica un código postal válido.";
  if(!input.city?.trim())errors.city="Indica la localidad.";
  if(!input.province?.trim())errors.province="Indica la provincia.";
  if(!/^[A-Z]{2}$/.test(input.countryCode?.trim().toUpperCase()))errors.countryCode="Indica el país.";
  if(!input.privacyAccepted)errors.privacyAccepted="Debes aceptar el tratamiento de los datos.";
  return errors;
}

export function profileCompletion(input:CustomerProfileInput):ProfileCompletion{
  const errors=validateCustomerProfile(input);
  const missing=profileFieldOrder.filter(field=>field in errors);
  return {complete:missing.length===0,missing};
}

const statusLabels:Record<PublicInquiryStatus,string>={
  received:"Recibida",
  reviewing:"En revisión",
  awaiting_customer:"Información pendiente",
  quoted:"Oferta preparada",
  closed:"Cerrada",
};

export function publicInquiryStatus(value:string){return statusLabels[value as PublicInquiryStatus]??statusLabels.received;}
