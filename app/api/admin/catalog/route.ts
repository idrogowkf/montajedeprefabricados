import {auth} from "@clerk/nextjs/server";
import {getCatalog,updateCommercial} from "@/lib/catalog-db";

export const dynamic="force-dynamic";
export async function GET(){const {userId}=await auth();if(!userId)return Response.json({error:"No autorizado"},{status:401});return Response.json({products:await getCatalog()});}
export async function PATCH(request:Request){const {userId}=await auth();if(!userId)return Response.json({error:"No autorizado"},{status:401});try{const body=await request.json();return Response.json({product:await updateCommercial(String(body.id),body.patch??{},userId)});}catch(error){return Response.json({error:error instanceof Error?error.message:"Solicitud no válida"},{status:400});}}
