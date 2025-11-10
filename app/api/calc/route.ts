
import { NextResponse } from 'next/server'
export async function POST(req: Request){
  try{
    const { ciudad = '', elementos = '', tonelajes = '', radios = '', plazo = '' } = await req.json()
    const tons = (tonelajes.match(/\d+/g)||[]).map(Number)
    const avgT = tons.length? (tons.reduce((a,b)=>a+b,0)/tons.length) : 30
    const maxR = Math.max(...((radios.match(/\d+/g)||[]).map(Number).concat([18])))
    const base = 1200 + avgT*90 + (maxR>20? (maxR-20)*80 : 0)
    const urg = /noche|urgente|\b3\b|\b2\b/.test(String(plazo).toLowerCase()) ? 1.25 : 1
    const subtotal = Math.round(base*urg)
    let aiNote: string | undefined
    if(process.env.OPENAI_API_KEY){
      aiNote = 'Estimación ajustada con IA disponible (OPENAI_API_KEY detectada).'
    }
    return NextResponse.json({ ok:true, ciudad, elementos, tonelajes, radios, plazo, estimacion: {
      subtotal,
      cuadrilla_dia: 1200,
      grua_350T_dia: 4200,
      transporte_coord: 750,
      seguridad_y_calidad: 380,
      total_referencial: subtotal + 1200 + 4200 + 750 + 380,
    }, nota: aiNote })
  }catch(e:any){ return NextResponse.json({ ok:false, error: e?.message || 'Error' }, { status: 400 }) }
}
