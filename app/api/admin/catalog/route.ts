import {getCatalog,updateCatalogProducts} from "@/lib/catalog-db";
import {requireAdminIdentity} from "@/lib/admin-access.server";

export const dynamic="force-dynamic";
export async function GET(){const userId=await requireAdminIdentity();if(!userId)return Response.json({error:"No autorizado"},{status:403});return Response.json({products:await getCatalog()});}
export async function PATCH(request:Request){const userId=await requireAdminIdentity();if(!userId)return Response.json({error:"No autorizado"},{status:403});try{const body=await request.json();const ids=Array.isArray(body.ids)?body.ids:[body.id];const products=await updateCatalogProducts(ids,{commercial:body.commercial??body.patch,content:body.content},userId);return Response.json({products,product:products[0]});}catch(error){return Response.json({error:error instanceof Error?error.message:"Solicitud no válida"},{status:400});}}
