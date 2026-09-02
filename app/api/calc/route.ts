import type {NextRequest} from "next/server";
import {estimateAssembly,type CalcInput} from "@/lib/calc/estimate";
export const runtime="nodejs";
export async function POST(request:NextRequest){try{const input=await request.json() as CalcInput;return Response.json({ok:true,input:{ciudad:input.ciudad?.trim()??"",elementos:input.elementos?.trim()??"",tonelajes:input.tonelajes??"",radios:input.radios??"",plazo:input.plazo??""},calculo:estimateAssembly(input),nota:"Estimación orientativa. El cálculo detallado y selección de grúa se realiza en el presupuesto técnico."})}catch(error:unknown){const message=error instanceof Error?error.message:"Error desconocido";return Response.json({ok:false,error:message},{status:400})}}
export function GET(){return Response.json({ok:false,error:"Method Not Allowed"},{status:405})}
