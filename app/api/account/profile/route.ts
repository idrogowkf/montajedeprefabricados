import {NextResponse} from "next/server";
import {profileCompletion,validateCustomerProfile,type CustomerProfileInput} from "@/lib/customer-account";
import {getCustomerProfile,linkHistoricalInquiries,upsertCustomerProfile} from "@/lib/customer-account-db";
import {getCustomerIdentity} from "@/lib/customer-identity.server";

const fields:Array<keyof CustomerProfileInput>=["customerType","contactName","legalName","taxIdType","taxId","phone","addressLine1","addressLine2","postalCode","city","province","countryCode","privacyAccepted"];

function profileInput(value:unknown):CustomerProfileInput{
  const source=value&&typeof value==="object"?value as Record<string,unknown>:{};
  const picked={} as Record<keyof CustomerProfileInput,unknown>;
  for(const field of fields)picked[field]=source[field];
  return {
    customerType:String(picked.customerType??"") as CustomerProfileInput["customerType"],contactName:String(picked.contactName??""),legalName:String(picked.legalName??""),
    taxIdType:String(picked.taxIdType??"") as CustomerProfileInput["taxIdType"],taxId:String(picked.taxId??""),phone:String(picked.phone??""),addressLine1:String(picked.addressLine1??""),
    addressLine2:String(picked.addressLine2??""),postalCode:String(picked.postalCode??""),city:String(picked.city??""),province:String(picked.province??""),countryCode:String(picked.countryCode??"").toUpperCase(),privacyAccepted:picked.privacyAccepted===true,
  };
}

export async function GET(){
  const identity=await getCustomerIdentity();
  if(!identity)return NextResponse.json({ok:false,error:"Debes iniciar sesión."},{status:401});
  const profile=await getCustomerProfile(identity.userId);
  const initial=profile??profileInput({contactName:[identity.firstName,identity.lastName].filter(Boolean).join(" "),countryCode:"ES"});
  return NextResponse.json({ok:true,identity:{email:identity.email,firstName:identity.firstName,lastName:identity.lastName},profile,completion:profileCompletion(initial)});
}

export async function PUT(request:Request){
  const identity=await getCustomerIdentity();
  if(!identity)return NextResponse.json({ok:false,error:"Debes iniciar sesión."},{status:401});
  let body:unknown;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Solicitud no válida."},{status:400});}
  const input=profileInput(body),errors=validateCustomerProfile(input);
  if(Object.keys(errors).length)return NextResponse.json({ok:false,errors},{status:400});
  const profile=await upsertCustomerProfile(identity.userId,identity.email,input);
  const linkedInquiries=await linkHistoricalInquiries(identity.userId,identity.verifiedEmails);
  return NextResponse.json({ok:true,profile,completion:profileCompletion(profile),linkedInquiries});
}
