import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {getProductInquiries} from "@/lib/catalog-db";
export async function GET(){const {userId}=await auth();if(!userId)return NextResponse.json({error:"No autorizado"},{status:401});try{return NextResponse.json({inquiries:await getProductInquiries()});}catch(cause){return NextResponse.json({error:cause instanceof Error?cause.message:"No se pudo cargar la bandeja"},{status:500});}}
