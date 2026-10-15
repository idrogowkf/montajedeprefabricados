import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {anonymizeCustomerAccount,hasCompletedAccountDeletion,requestCustomerAccountDeletion} from "@/lib/customer-account-db";
import {getCustomerIdentity} from "@/lib/customer-identity.server";

export async function DELETE(request:Request){
 const identity=await getCustomerIdentity();if(!identity)return NextResponse.json({ok:false,error:"Debes iniciar sesión."},{status:401});
 let body:unknown;try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Confirmación no válida."},{status:400});}
 if((body as {confirmation?:unknown})?.confirmation!=="ELIMINAR MI CUENTA")return NextResponse.json({ok:false,error:"Escribe exactamente ELIMINAR MI CUENTA."},{status:400});
 try{if(await hasCompletedAccountDeletion(identity.userId))return NextResponse.json({ok:true});await requestCustomerAccountDeletion(identity.userId);await anonymizeCustomerAccount(identity.userId);await auth.api.deleteUser({headers:headers(),body:{}});console.info("[account-delete] completed",identity.userId);return NextResponse.json({ok:true});}catch(error){console.error("[account-delete] failed",identity.userId,error instanceof Error?error.name:"unknown");return NextResponse.json({ok:false,error:"No se pudo completar la eliminación. Inténtalo de nuevo."},{status:503});}
}
