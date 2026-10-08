import {NextResponse} from "next/server";
import {getProductInquiries} from "@/lib/catalog-db";
import {requireAdminIdentity} from "@/lib/admin-access.server";
export const dynamic="force-dynamic";
export const maxDuration=30;
export async function GET(){const userId=await requireAdminIdentity();if(!userId)return NextResponse.json({error:"No autorizado"},{status:403});try{return NextResponse.json({inquiries:await getProductInquiries()});}catch(cause){console.error("[/api/admin/product-inquiries GET]",cause);return NextResponse.json({error:"No se pudo cargar la bandeja. Inténtalo de nuevo."},{status:503});}}
