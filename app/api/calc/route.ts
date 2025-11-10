// app/api/calc/route.ts
import type { NextRequest } from "next/server";

/**
 * Mini endpoint de estimación rápida (usado por la calculadora del landing).
 * - Tipado estricto (sin any implícitos) para pasar el build en Vercel
 * - Parseo robusto de números en "tonelajes" y "radios"
 * - Fallbacks seguros cuando faltan datos
 */

export const runtime = "nodejs";

type CalcBody = {
    ciudad?: string;
    elementos?: string;
    tonelajes?: string; // "45T, 70t"
    radios?: string;    // "18 m, 22m"
    plazo?: string;     // "3 diurnas", "2 nocturnas"
};

function parseNumbers(input?: string): number[] {
    if (!input) return [];
    const matches = input.match(/\d+(\.\d+)?/g) ?? [];
    return matches
        .map((s: string) => Number(s))
        .filter((n: number) => Number.isFinite(n));
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

export async function POST(req: NextRequest) {
    try {
        const { ciudad = "", elementos = "", tonelajes = "", radios = "", plazo = "" } =
            (await req.json()) as CalcBody;

        const tons: number[] = parseNumbers(tonelajes);
        const avgT: number =
            tons.length > 0
                ? tons.reduce((sum: number, v: number) => sum + v, 0) / tons.length
                : 30; // por defecto 30 t

        const radii: number[] = parseNumbers(radios);
        const maxR: number = radii.length > 0 ? Math.max(...radii) : 18; // por defecto 18 m

        // Misma heurística ligera que tenías
        const base = 1200 + avgT * 90 + (maxR > 20 ? (maxR - 20) * 80 : 0);

        const p = plazo.toLowerCase();
        const isNocturna = /\b(noche|nocturna|nocturno)\b/.test(p);
        const isUrgente = /\b(2|3)\b/.test(p) || /urgente/.test(p);
        const urgFactor = isNocturna ? 1.25 : isUrgente ? 1.15 : 1;

        const total = round2(base * urgFactor);

        return Response.json({
            ok: true,
            input: { ciudad: ciudad.trim(), elementos: elementos.trim(), tonelajes, radios, plazo },
            calculo: {
                avg_tonelaje: round2(avgT),
                radio_max: maxR,
                base: round2(base),
                factor_urgencia: urgFactor,
                total,
            },
            nota:
                "Estimación orientativa. El cálculo detallado y selección de grúa lo hace /api/presupuesto con curvas y tarifas.",
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        return new Response(JSON.stringify({ ok: false, error: msg }), { status: 400 });
    }
}

export async function GET() {
    return new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), { status: 405 });
}
