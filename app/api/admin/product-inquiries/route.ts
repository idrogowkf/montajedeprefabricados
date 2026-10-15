import {NextResponse} from "next/server";
import {getProductInquiries} from "@/lib/catalog-db";
import {requireAdminIdentity} from "@/lib/admin-access.server";
import {isAllowedInquiryStatus,updateInquiryStatus} from "@/lib/customer-account-db";
export const dynamic="force-dynamic";
export const maxDuration=30;
export async function GET(){const userId=await requireAdminIdentity();if(!userId)return NextResponse.json({error:"No autorizado"},{status:403});try{return NextResponse.json({inquiries:await getProductInquiries()});}catch(cause){console.error("[/api/admin/product-inquiries GET]",cause);return NextResponse.json({error:"No se pudo cargar la bandeja. Inténtalo de nuevo."},{status:503});}}
export async function PATCH(request:Request){const actorId=await requireAdminIdentity();if(!actorId)return NextResponse.json({error:"No autorizado"},{status:403});try{const body=await request.json() as {id?:unknown;publicStatus?:unknown;adminNotes?:unknown},id=String(body.id??""),publicStatus=String(body.publicStatus??""),adminNotes=String(body.adminNotes??"");if(!id||!isAllowedInquiryStatus(publicStatus)||adminNotes.length>2000)return NextResponse.json({error:"Datos de seguimiento no válidos."},{status:400});return NextResponse.json({inquiry:await updateInquiryStatus(id,publicStatus,adminNotes,actorId)});}catch(cause){console.error("[/api/admin/product-inquiries PATCH]",cause);return NextResponse.json({error:"No se pudo actualizar la solicitud."},{status:503});}}
