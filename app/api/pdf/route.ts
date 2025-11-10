import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export async function POST(req: Request){
  const { cliente='Cliente S.A.', obra='Montaje de prefabricados', ciudad='España', alcance=['Vigas','Grúa','Transporte'], precio=10000 } = await req.json()
  const doc = new PDFDocument({ margin: 40 })
  const chunks: any[] = []
  doc.on('data', (c: any)=> chunks.push(c))
  const done: Promise<Buffer> = new Promise(resolve => doc.on('end', () => resolve(Buffer.concat(chunks as any))))

  doc.fillColor('#111').fontSize(18).text('Montaje de Prefabricados — Propuesta', { underline: true })
  doc.moveDown().fontSize(12).fillColor('#333').text(`Cliente: ${cliente}`)
  doc.text(`Obra: ${obra}`)
  doc.text(`Ciudad: ${ciudad}`)
  doc.moveDown().fillColor('#555').text('Alcance:')
  ;(alcance as any[]).forEach((a:any)=> doc.text(` • ${a}`))
  doc.moveDown().fillColor('#111').fontSize(14).text(`Precio ofertado (referencial): € ${Number(precio).toLocaleString('es-ES')}`)
  doc.moveDown().fontSize(10).fillColor('#777').text('Nota: oferta orientativa sujeta a visita, accesos, radios y disponibilidad de equipos. Incluye coordinación con Ibercarga y plan de izados.')
  doc.end()

  const buf = await done
  return new NextResponse(buf, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="Propuesta-Montaje.pdf"' } })
}
