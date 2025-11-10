// app/api/calc/route.ts
import type { NextRequest } from "next/server";

/**
 * Mini endpoint de estimación rápida (usado por la calculadora ligera del landing).
 * - Tipado estricto para pasar build en Vercel (noImplicitAny)
 * - Parseo robusto de números en strings "tonelajes" y "radios"
 * - Fallbacks seguros cuando no hay datos
 */

export const runtime = "nodejs"; // asegurar entorno Node en Vercel

type CalcBody = {
    ciudad?: string;
    elementos?: string;
    tonelajes?: string; // e.g. "45T, 70t"
    radios?: string;    // e.g. "18 m, 22m"
    plazo?: string;     // e.g. "3 diurnas", "2 nocturnas"
};

function parseNumbers(input: string | undefined): number[] {
    if (!input) return [];
    const matches = input.match(/\d+(\.\d+)?/g) ?? [];
    return matches.map((s: string) => Number(s)).filter((n: number) => Number.isFinite(n));
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as CalcBody;

        const ciudad = (body.ciudad ?? "").trim();
        const elementos = (body.elementos ?? "").trim();
        const tonelajes = (body.tonelajes ?? "").trim();
        const radios = (body.radios ?? "").trim();
        const plazo = (body.plazo ?? "").trim().toLowerCase();

        const tons: number[] = parseNumbers(tonelajes);
        const avgT: number =
            tons.length > 0
                ? tons.reduce((sum: number, value: number) => sum + value, 0) / tons.length
                : 30; // por defecto 30 t

        const radii: number[] = parseNumbers(radios);
        const maxR: number = radii.length > 0 ? Math.max(...radii) : 18; // por defecto 18 m

        // Fórmula simple (misma lógica anterior + tipos)
        const base = 1200 + avgT * 90 + (maxR > 20 ? (maxR - 20) * 80 : 0);

        // Recargo por urgencia / nocturna (heurística ligera)
        const isNocturna = /\b(noche|nocturna|nocturno)\b/.test(plazo);
        const isUrgente = /\b(2|3)\b/.test(plazo) || /urgente/.test(plazo);
        const urgFactor = isNocturna ? 1.25 : isUrgente ? 1.15 : 1;

        const total = round2(base * urgFactor);

        return Response.json({
            ok: true,
            input: { ciudad, elementos, tonelajes, radios, plazo },
            calculo: {
                avg_tonelaje: round2(avgT),
                radio_max: maxR,
                base: round2(base),
                factor_urgencia: urgFactor,
                total,
            },
            nota:
                "Estimación orientativa. El cálculo detallado y selección de grúa lo realiza /api/presupuesto con curvas y tarifas.",
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 });
    }
}

// (Opcional) rechazar otros métodos con 405 para claridad
export async function GET() {
    return new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), { status: 405 });
}
