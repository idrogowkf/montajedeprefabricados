import {NextResponse} from "next/server";
import {sendContactEmail} from "@/lib/contact/email";
import {parseContactRequest} from "@/lib/contact/validation";

export async function POST(request:Request){try{const contact=parseContactRequest(await request.json());const result=await sendContactEmail(contact);if(result.error)return NextResponse.json({ok:false,error:result.error},{status:502});return NextResponse.json({ok:true})}catch(error:unknown){const message=error instanceof Error?error.message:"Error inesperado";const status=message==="Faltan campos obligatorios"?400:message==="Servicio de correo no configurado"?503:500;console.error("Error general en /api/contact:",message);return NextResponse.json({ok:false,error:message},{status})}}
