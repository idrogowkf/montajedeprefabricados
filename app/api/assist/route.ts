
import { NextResponse } from 'next/server'
export async function POST(req: Request){
  const { messages = [] } = await req.json()
  let answer = 'Para cotizar: ciudad, elementos (vigas/paneles/losas), tonelajes, radios y plazos. Coordinamos transporte con Ibercarga y seleccionamos grúas 80–500T+.'
  return NextResponse.json({ ok:true, answer, messages })
}
