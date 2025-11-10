import { NextResponse } from 'next/server'

// Muy importante: PDFKit necesita Node.js, no Edge.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Utilidad pequeña para formatear moneda
const euro = (n: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)

type BodyIn = {
    cliente?: string
    obra?: string
    ciudad?: string
    alcance?: string[]  // descripciones de partidas
    partidas?: Array<{ partida: string; descripcion: string; precioPublico: number }>
    subtotPublico?: number
    ivaPublico?: number
    totalPublico?: number
    notas?: string
    // Interno (para que el PDF del cliente no muestre costes)
    interno?: {
        partidasCoste?: Array<{ partida: string; descripcion: string; coste: number }>
        subtotCoste?: number
        ivaCoste?: number
        totalCoste?: number
    } | null
    // Si generamos “resumen por fallo de IA” u otras variantes
    modo?: 'cliente' | 'interno' | 'resumen'
}

export async function POST(req: Request) {
    try {
        const {
            cliente = 'Cliente S.A.',
            obra = 'Montaje de prefabricados',
            ciudad = 'España',
            alcance = ['Vigas', 'Grúa', 'Transporte'],
            partidas = [],
            subtotPublico = 0,
            ivaPublico = 0,
            totalPublico = 0,
            notas = 'Estimación sujeta a visita de obra, verificación de radios/pesos y disponibilidad.',
            interno = null,
            modo = 'cliente',
        } = (await req.json()) as BodyIn

        // Lazy import: evita que el bundler intente resolver pdfkit en tiempo de build
        const PDFDocument = (await import('pdfkit')).default

        // Generamos el PDF en memoria
        const doc = new PDFDocument({ size: 'A4', margin: 36 }) // 36 = 0.5"
        const chunks: Buffer[] = []
        doc.on('data', (c: Buffer) => chunks.push(c))
        const done = new Promise<Buffer>((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)))
        })

        // ------------ Cabecera ------------
        doc
            .fontSize(18)
            .fillColor('#111')
            .text('MONTAJE DE PREFABRICADOS', { align: 'left' })
            .moveDown(0.2)
        doc
            .fontSize(10)
            .fillColor('#444')
            .text('ofertas@montajedeprefabricados.com · +34 624 473 123', { align: 'left' })
            .moveDown(0.8)
        doc.moveTo(36, doc.y).lineTo(559, doc.y).strokeColor('#eab308').lineWidth(2).stroke().moveDown(0.6)

        // ------------ Datos cliente/obra ------------
        doc
            .fontSize(12)
            .fillColor('#111')
            .text(`Cliente: ${cliente}`)
            .moveDown(0.2)
        doc.text(`Obra: ${obra}`).moveDown(0.2)
        doc.text(`Ciudad: ${ciudad}`).moveDown(0.6)

        // ------------ Título documento ------------
        const titulo =
            modo === 'interno'
                ? 'Descompuesto Interno (Costes + PVP)'
                : modo === 'resumen'
                    ? 'Resumen de Solicitud'
                    : 'Presupuesto orientativo de montaje (PVP)'

        doc.fontSize(14).fillColor('#111').text(titulo).moveDown(0.4)

        // ------------ Alcance (viñetas) ------------
        doc.fontSize(11).fillColor('#111').text('Alcance y supuestos:', { underline: true })
        doc.moveDown(0.2).fontSize(10).fillColor('#222')
        alcance.forEach((a) => {
            doc.circle(doc.x + 2, doc.y + 6, 1.5).fill('#eab308').fillColor('#222')
            doc.text(`   ${a}`, { continued: false })
        })
        doc.moveDown(0.6)

        // ------------ Tabla PÚBLICO ------------
        const renderTabla = ({
            titulo,
            filas,
            mostrarImporte = true,
        }: {
            titulo: string
            filas: Array<{ partida: string; descripcion: string; importe?: number }>
            mostrarImporte?: boolean
        }) => {
            // Cabecera de tabla
            const x0 = 36
            const x1 = 200
            const x2 = 430
            const xRight = 559
            const y0 = doc.y

            doc.fontSize(11).fillColor('#111').text(titulo).moveDown(0.2)
            doc
                .strokeColor('#ccc')
                .lineWidth(1)
                .rect(x0, doc.y, xRight - x0, 20)
                .stroke()

            doc
                .fontSize(10)
                .fillColor('#111')
                .text('Partida', x0 + 6, doc.y - 14, { width: x1 - x0 - 12 })
                .text('Descripción', x1 + 6, doc.y - 14, { width: x2 - x1 - 12 })
            if (mostrarImporte) {
                doc.text('Importe', x2 + 6, doc.y - 14, { width: xRight - x2 - 12, align: 'right' })
            }

            // Filas
            filas.forEach((f) => {
                const h = 22
                const y = doc.y
                doc
                    .strokeColor('#eee')
                    .lineWidth(0.7)
                    .rect(x0, y, xRight - x0, h)
                    .stroke()

                doc
                    .fontSize(9.5)
                    .fillColor('#222')
                    .text(f.partida, x0 + 6, y + 5, { width: x1 - x0 - 12 })
                    .text(f.descripcion, x1 + 6, y + 5, { width: x2 - x1 - 12 })
                if (mostrarImporte) {
                    doc.text(f.importe != null ? euro(f.importe) : '-', x2 + 6, y + 5, {
                        width: xRight - x2 - 12,
                        align: 'right',
                    })
                }
                doc.y = y + h
            })

            doc.moveDown(0.4)
        }

        // PVP (para cliente y también visible en “interno”)
        const filasPublico = partidas.map((p) => ({
            partida: p.partida,
            descripcion: p.descripcion,
            importe: p.precioPublico,
        }))
        renderTabla({ titulo: 'Partidas (Precio al público)', filas: filasPublico, mostrarImporte: true })

        // Totales PVP
        doc
            .fontSize(10)
            .fillColor('#111')
            .text(`Subtotal: ${euro(subtotPublico)}`, { align: 'right' })
            .text(`IVA (21%): ${euro(ivaPublico)}`, { align: 'right' })
            .fontSize(12)
            .text(`TOTAL: ${euro(totalPublico)}`, { align: 'right' })
            .moveDown(0.6)

        // Si es “interno”, renderizamos también costes
        if (modo === 'interno' && interno?.partidasCoste?.length) {
            const filasCoste = interno.partidasCoste.map((p) => ({
                partida: p.partida,
                descripcion: p.descripcion,
                importe: p.coste,
            }))
            renderTabla({ titulo: 'Partidas (Coste interno)', filas: filasCoste, mostrarImporte: true })

            doc
                .fontSize(10)
                .fillColor('#111')
                .text(`Subtotal coste: ${euro(interno.subtotCoste || 0)}`, { align: 'right' })
                .text(`IVA (21%): ${euro(interno.ivaCoste || 0)}`, { align: 'right' })
                .fontSize(12)
                .text(`TOTAL coste: ${euro(interno.totalCoste || 0)}`, { align: 'right' })
                .moveDown(0.6)
        }

        // Notas
        doc.moveDown(0.2)
        doc.fontSize(10).fillColor('#333').text(notas, {
            align: 'justify',
        })

        doc.end()
        const pdfBuffer = await done

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="presupuesto_${Date.now()}.pdf"`,
                'Cache-Control': 'no-store',
            },
        })
    } catch (err: any) {
        console.error('[api/pdf] ERROR:', err?.message || err)
        return NextResponse.json(
            { ok: false, error: err?.message || 'Fallo al generar PDF' },
            { status: 500 }
        )
    }
}
