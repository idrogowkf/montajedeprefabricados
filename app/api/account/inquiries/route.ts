import {NextResponse} from "next/server";
import {getCustomerInquiries,getCustomerInquirySummary} from "@/lib/customer-account-db";
import {getCustomerIdentity} from "@/lib/customer-identity.server";

function safeDocuments(value:unknown){
  if(!Array.isArray(value))return [];
  return value.filter(item=>item&&typeof item==="object"&&typeof item.name==="string"&&typeof item.url==="string"&&item.url.startsWith("https://")).map(item=>({name:item.name,url:item.url,size:typeof item.size==="number"?item.size:0}));
}

export async function GET(){
  const identity=await getCustomerIdentity();
  if(!identity)return NextResponse.json({ok:false,error:"Debes iniciar sesión."},{status:401});
  const [summary,rows]=await Promise.all([getCustomerInquirySummary(identity.userId),getCustomerInquiries(identity.userId)]);
  const inquiries=rows.map(row=>({reference:String(row.id),kind:String(row.kind),productId:String(row.product_id??""),productName:String(row.product_name??"Búsqueda asistida"),message:String(row.message??""),documents:safeDocuments(row.documents),status:String(row.public_status??"received"),createdAt:new Date(row.created_at as string|Date).toISOString(),updatedAt:new Date(row.updated_at as string|Date).toISOString()}));
  return NextResponse.json({ok:true,summary,inquiries});
}
