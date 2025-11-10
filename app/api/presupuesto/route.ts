// app/api/presupuesto/route.ts
import type { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/** ============================================================
 *  Presupuestos con curvas Liebherr + partidas + PDF tabular
 *  MODE:
 *   - "calcular": devuelve partidas+tabla+PDF (NO envía emails)
 *   - "enviar":   envía emails con PDFs (cliente sin costes / interno con costes)
 * ============================================================ */

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MAIL_FROM =
    process.env.MAIL_FROM || "Ofertas <ofertas@montajedeprefabricados.com>";
const MAIL_TO =
    process.env.MAIL_TO || "ofertas@montajedeprefabricados.com";
const OPENAI_API_KEY =
    process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY || "";

const MARKUP_CREW = Number(process.env.MARKUP_CREW || 1.2);
const MARKUP_CRANE = Number(process.env.MARKUP_CRANE || 1.25);
const MARKUP_MISC = Number(process.env.MARKUP_MISC || 1.15);

// ---------- Helpers ----------
function round2(n: number) { return Math.round(n * 100) / 100; }
function normalizeCity(raw?: string) {
    const c = (raw || "").trim().toLowerCase();
    if (!c) return "Madrid";
    if (c.startsWith("madri")) return "Madrid";
    if (c.startsWith("vale") || /quart|poblet|sagunto|alicante|castell[oó]n/.test(c)) return "Valencia";
    if (c.startsWith("barc")) return "Barcelona";
    if (c.startsWith("zar")) return "Zaragoza";
    if (c.startsWith("sev")) return "Sevilla";
    return (raw || "Madrid").trim();
}

// ---------- Curvas (conservadoras) ----------
type CraneClass = "60T" | "90T" | "100T" | "120T" | "150T" | "250T" | "350T";
const CAPACITY_BY_CLASS: Record<CraneClass, Record<number, number>> = {
    "60T": { 10: 18, 12: 14, 14: 11, 16: 9, 18: 7, 20: 6, 22: 5, 24: 4, 26: 3.5, 28: 3.0, 30: 2.5, 35: 1.8, 40: 1.2 },
    "90T": { 10: 28, 12: 22, 14: 18, 16: 15, 18: 12, 20: 10, 22: 8.5, 24: 7.5, 26: 6.5, 28: 5.8, 30: 5.0, 35: 3.5, 40: 2.5 },
    "100T": { 10: 32, 12: 26, 14: 22, 16: 18, 18: 15, 20: 13, 22: 11, 24: 9.5, 26: 8.5, 28: 7.5, 30: 6.5, 35: 4.5, 40: 3.2 },
    "120T": { 10: 40, 12: 32, 14: 28, 16: 24, 18: 20, 20: 17, 22: 15, 24: 13, 26: 11.5, 28: 10, 30: 9, 35: 6.2, 40: 4.5 },
    "150T": { 10: 48, 12: 40, 14: 34, 16: 30, 18: 26, 20: 22, 22: 19, 24: 17, 26: 15, 28: 13.5, 30: 12, 35: 8.5, 40: 6.0 },
    "250T": { 10: 70, 12: 60, 14: 52, 16: 46, 18: 40, 20: 35, 22: 31, 24: 28, 26: 26, 28: 23, 30: 21, 35: 16, 40: 12 },
    "350T": { 10: 90, 12: 80, 14: 70, 16: 62, 18: 55, 20: 49, 22: 44, 24: 40, 26: 37, 28: 34, 30: 31, 35: 24, 40: 18 },
};
function capacityAtRadius(cls: CraneClass, r: number) {
    const t = CAPACITY_BY_CLASS[cls];
    const keys = Object.keys(t).map(Number).sort((a, b) => a - b);
    let last = keys[0];
    for (const k of keys) { if (r === k) return t[k]; if (r < k) return t[last]; last = k; }
    return t[last];
}
function recommendCraneClassByCharts(weightT: number, radiusM: number): CraneClass | "A CONVENIR" {
    const required = weightT * 1.1 * 1.3;
    const order: CraneClass[] = ["60T", "90T", "100T", "120T", "150T", "250T", "350T"];
    for (const c of order) if (capacityAtRadius(c, radiusM) >= required) return c;
    return "A CONVENIR";
}

// ---------- Tarifas / ciudades ----------
type Provider = "Rigar" | "Aguado" | "Generic";
type CityRates = {
    provider: Provider;
    availability: string[];
    hourly?: Record<string, number>;
    min_hours?: number;
    km_per_km_default?: number;
    hourly_by_class?: Record<string, number>;
    min_hours_by_class?: Record<string, number>;
    km_per_km_by_class?: Record<string, number>;
    salida_by_class?: Record<string, number>;
    extra_pct_by_class?: Record<string, number>;
};

const RIGAR_VALENCIA: CityRates = {
    provider: "Rigar",
    availability: ["60T", "90T", "100T", "120T", "150T", "250T", "350T"],
    hourly: { "60T": 95, "70T": 102, "80T": 112, "90T": 129, "100T": 139, "120T": 179, "150T": 201, "200T": 245, "250T": 286, "300T": 310, "350T": 340 },
    min_hours: 7, km_per_km_default: 3.2,
};
const AGUADO_MADRID: CityRates = {
    provider: "Aguado",
    availability: ["60T", "90T", "100T", "120T", "150T", "250T", "350T"],
    hourly_by_class: { "60T": 85.50, "90T": 117.00, "100T": 150.30, "120T": 154.80, "150T": 186.30, "250T": 287.10, "350T": 392.40 },
    min_hours_by_class: { "60T": 6, "90T": 6, "100T": 8, "120T": 8, "150T": 8, "250T": 8, "350T": 8 },
    km_per_km_by_class: { "60T": 2.87, "90T": 4.50, "100T": 4.57, "120T": 4.64, "150T": 5.60, "250T": 8.83, "350T": 10.13 },
    salida_by_class: { "60T": 177.30, "90T": 331.20, "100T": 620.10, "120T": 891.00, "150T": 1251.00, "250T": 2921.40, "350T": 4449.60 },
    extra_pct_by_class: { "60T": 0.45, "90T": 0.40, "100T": 0.30, "120T": 0.30, "150T": 0.30, "250T": 0.20, "350T": 0.20 }
};
const GENERIC_CITY: CityRates = {
    provider: "Generic",
    availability: ["60T", "90T", "100T", "120T", "150T", "250T", "350T"],
    hourly: { "60T": 190, "90T": 240, "100T": 310, "120T": 380, "150T": 460, "250T": 820, "350T": 1000 },
    min_hours: 4, km_per_km_default: 3.0,
};
const CITY_TABLE: Record<string, CityRates> = {
    Madrid: AGUADO_MADRID, Valencia: RIGAR_VALENCIA, Barcelona: GENERIC_CITY, Zaragoza: GENERIC_CITY, Sevilla: GENERIC_CITY,
};
const DIST_KM: Record<string, Record<string, number>> = {
    Madrid: { Madrid: 0, Valencia: 355, Barcelona: 620, Zaragoza: 315, Sevilla: 530 },
    Valencia: { Madrid: 355, Valencia: 0, Barcelona: 350, Zaragoza: 310, Sevilla: 650 },
    Barcelona: { Madrid: 620, Valencia: 350, Barcelona: 0, Zaragoza: 300, Sevilla: 1000 },
    Zaragoza: { Madrid: 315, Valencia: 310, Barcelona: 300, Zaragoza: 0, Sevilla: 820 },
    Sevilla: { Madrid: 530, Valencia: 650, Barcelona: 1000, Zaragoza: 820, Sevilla: 0 },
};

// ---------- Email / OpenAI ----------
async function sendEmail({ to, subject, html, attachments }: {
    to: string; subject: string; html: string;
    attachments?: Array<{ filename: string; content: string }>
}) {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY ausente");
    const body: any = { from: MAIL_FROM, to, subject, html };
    if (attachments?.length) body.attachments = attachments;
    const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`Resend error: ${r.status} ${await r.text()}`);
}
async function askOpenAI(prompt: string): Promise<string | null> {
    if (!OPENAI_API_KEY) return null;
    try {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.2,
                messages: [
                    { role: "system", content: "Eres ingeniero de montaje prefabricado. Redacta alcance/supuestos claros y conservadores; no comprometer sin visita de obra." },
                    { role: "user", content: prompt },
                ],
            }),
        });
        if (!r.ok) return null;
        const j = await r.json();
        return j?.choices?.[0]?.message?.content ?? null;
    } catch { return null; }
}

// ---------- Cálculo costes ----------
function pickCityForClass(preferredCity: string, craneClass: string) {
    const cityRates = CITY_TABLE[preferredCity] || GENERIC_CITY;
    if (craneClass === "A CONVENIR") return { city: preferredCity, availableHere: false };
    if (cityRates.availability.includes(craneClass)) return { city: preferredCity, availableHere: true };
    const distances = DIST_KM[preferredCity] || DIST_KM["Madrid"];
    const sorted = Object.entries(distances).sort((a, b) => a[1] - b[1]);
    for (const [city] of sorted) {
        const r = CITY_TABLE[city] || GENERIC_CITY;
        if (r.availability.includes(craneClass)) return { city, availableHere: false };
    }
    return { city: preferredCity, availableHere: false };
}
function computeCraneCost(jobCity: string, craneClass: string, hours: number, isNight: boolean, isHolidayNight: boolean, supplyCity?: string) {
    if (craneClass === "A CONVENIR") {
        return { cost: 0, public: 0, detail: "Capacidad > tabla o radio extremo: a convenir tras visita y estudio de curvas." };
    }
    const provCity = supplyCity || jobCity;
    const rates = CITY_TABLE[provCity] || GENERIC_CITY;

    if (rates.provider === "Aguado") {
        const h = rates.hourly_by_class?.[craneClass] || 0;
        const minH = rates.min_hours_by_class?.[craneClass] || 8;
        const kmPrice = rates.km_per_km_by_class?.[craneClass] || 0;
        const salida = rates.salida_by_class?.[craneClass] || 0;

        const hoursBill = Math.max(hours, minH);
        const pct = (isHolidayNight || isNight) ? (rates.extra_pct_by_class?.[craneClass] || 0.30) : 0;
        const recargoFactor = 1 + pct;

        const km = (DIST_KM[provCity]?.[jobCity] ?? 0) * 2;
        const kmCost = km * kmPrice;

        const baseCost = h * hoursBill;
        const cost = baseCost * recargoFactor + kmCost + salida;
        const pub = cost * MARKUP_CRANE;

        const detail = `Madrid/Aguado ${craneClass} · ${hoursBill}h mín · ${pct ? `+${Math.round(pct * 100)}%` : "0%"} · km i/v ${km} × ${kmPrice.toFixed(2)} € + salida ${salida.toFixed(2)} € · base ${provCity}`;
        return { cost: round2(cost), public: round2(pub), detail };
    }

    const priceH = rates.hourly?.[craneClass] ?? 0;
    const minH = rates.min_hours ?? 7;
    const hoursBill = Math.max(hours, minH);
    const kmPrice = rates.km_per_km_default ?? 3.0;

    let factor = 1;
    if (isHolidayNight) factor = 1.45;
    else if (isNight) factor = 1.35;

    const baseCost = priceH * hoursBill * factor;
    const km = (DIST_KM[provCity]?.[jobCity] ?? 0) * 2;
    const kmCost = km * kmPrice;

    const cost = baseCost + kmCost;
    const pub = cost * MARKUP_CRANE;
    const detail = `${rates.provider} ${craneClass} · ${hoursBill}h mín · ${factor > 1 ? `recargo x${factor}` : "diurno"} · km i/v ${km} × ${kmPrice.toFixed(2)} € · base ${provCity}`;
    return { cost: round2(cost), public: round2(pub), detail };
}
function computeCrewCost(teams: number, days: number, isNight: boolean, isHolidayNight: boolean) {
    const basePerTeamPerDay = 1150;
    let factor = 1;
    if (isHolidayNight) factor = 1.45;
    else if (isNight) factor = 1.35;

    const cost_per_team_day = basePerTeamPerDay * factor;
    const public_per_team_day = cost_per_team_day * MARKUP_CREW;

    const jornadasTot = teams * days;
    const cost = cost_per_team_day * jornadasTot;
    const pub = public_per_team_day * jornadasTot;

    return {
        cost: round2(cost),
        public: round2(pub),
        detail: `${teams} equipo(s) · ${days} jornada(s) · ${factor > 1 ? `recargo x${factor}` : "diurno"}`,
        unit_public: round2(public_per_team_day),
        unit_ud: "jornada",
        unit_qty: jornadasTot
    };
}

// ---------- Tipos salidas ----------
type PublicRow = { codigo: string; partida: string; descripcion: string; ud: string; cantidad: number; punit: number; importe: number; };

// ---------- PDF “Presto” ----------
async function generarPDFPublico(params: {
    cliente: string; contacto: string; emailCli: string; ciudad: string; obra: string; tipo_obra: string;
    partidas: PublicRow[]; subtotal: number; iva: number; total: number; ai: string | null;
    titulo?: string;
}) {
    const { cliente, contacto, emailCli, ciudad, obra, tipo_obra, partidas, subtotal, iva, total, ai, titulo } = params;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pageWidth = 595, pageHeight = 842, margin = 36, lineH = 12;

    const COLS = { codigo: margin, partida: margin + 40, descripcion: margin + 170, ud: margin + 360, cantidad: margin + 410, punit: margin + 470, importe: margin + 530 } as const;

    const newPage = () => pdfDoc.addPage([pageWidth, pageHeight]);
    const drawHeader = (page: any) => {
        let y = page.getSize().height - margin;
        page.drawText("Montajedeprefabricados.com", { x: margin, y, size: 16, font: fontB, color: rgb(0.92, 0.73, 0.08) }); y -= 20;
        page.drawText(titulo || "Presupuesto técnico orientativo (no vinculante)", { x: margin, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) }); y -= 16;
        page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, color: rgb(0.85, 0.85, 0.85) }); y -= 16;

        const rows = [
            ["Cliente", `${cliente}${contacto ? ` — ${contacto}` : ""}`],
            ["Email", emailCli || "-"],
            ["Ciudad", ciudad],
            ["Obra/Periodo", obra || "-"],
            ["Tipo de obra", tipo_obra || "-"],
        ];
        for (const [k, v] of rows) { page.drawText(`${k}:`, { x: margin, y, size: 10, font: fontB }); page.drawText(v, { x: margin + 110, y, size: 10, font }); y -= lineH; }
        y -= 10;
        page.drawRectangle({ x: margin - 2, y: y - 4, width: pageWidth - margin * 2 + 4, height: 18, color: rgb(0.94, 0.94, 0.94) });
        page.drawText("Partida", { x: COLS.codigo, y, size: 10, font: fontB });
        page.drawText("Descripción", { x: COLS.partida, y, size: 10, font: fontB });
        page.drawText("Ud", { x: COLS.ud, y, size: 10, font: fontB });
        page.drawText("Cant.", { x: COLS.cantidad, y, size: 10, font: fontB });
        page.drawText("P. Unit", { x: COLS.punit, y, size: 10, font: fontB });
        page.drawText("Importe", { x: COLS.importe, y, size: 10, font: fontB });
        y -= 14;
        return y;
    };
    const wrap = (text: string, maxChars: number) => {
        const words = (text || "").split(/\s+/); const lines: string[] = []; let line = "";
        for (const w of words) { if ((line + " " + w).trim().length > maxChars) { if (line) lines.push(line.trim()); line = w; } else { line += " " + w; } }
        if (line.trim()) lines.push(line.trim()); return lines;
    };

    let page = newPage(); let y = drawHeader(page);
    const drawRow = (r: PublicRow) => {
        const descLines = wrap(r.descripcion, 38);
        if (y - Math.max(lineH, descLines.length * lineH) < 120) { page = newPage(); y = drawHeader(page); }
        page.drawText(r.codigo, { x: COLS.codigo, y, size: 10, font });
        page.drawText(r.partida, { x: COLS.partida, y, size: 10, font });
        let yy = y; for (const ln of descLines) { page.drawText(ln, { x: COLS.descripcion, y: yy, size: 10, font }); yy -= lineH; }
        page.drawText(r.ud, { x: COLS.ud, y, size: 10, font });
        page.drawText(String(r.cantidad), { x: COLS.cantidad, y, size: 10, font });
        page.drawText(r.punit.toFixed(2) + " €", { x: COLS.punit, y, size: 10, font });
        page.drawText(r.importe.toFixed(2) + " €", { x: COLS.importe, y, size: 10, font: fontB });
        y -= Math.max(lineH, descLines.length * lineH) + 4;
        page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, color: rgb(0.92, 0.92, 0.92) });
        y -= 6;
    };

    partidas.forEach(drawRow);

    if (y < 120) { page = newPage(); y = drawHeader(page); }
    const boxX = pageWidth - margin - 200;
    const row = (label: string, value: string, bold = false) => {
        page.drawText(label, { x: boxX, y, size: 11, font: bold ? fontB : font });
        page.drawText(value, { x: boxX + 120, y, size: 11, font: bold ? fontB : font });
        y -= 14;
    };
    page.drawRectangle({ x: boxX - 8, y: y - 6, width: 220, height: 70, color: rgb(0.97, 0.97, 0.97) });
    row("Subtotal", subtotal.toFixed(2) + " €");
    row("IVA (21%)", iva.toFixed(2) + " €");
    row("TOTAL", total.toFixed(2) + " €", true);
    y -= 8;

    if (ai) {
        if (y < 140) { page = newPage(); y = drawHeader(page); }
        page.drawText("Alcance y supuestos", { x: margin, y, size: 12, font: fontB });
        y -= 16;
        const aiLines = wrap(ai, 95);
        for (const ln of aiLines) {
            if (y < 50) { page = newPage(); y = drawHeader(page); }
            page.drawText(ln, { x: margin, y, size: 10, font }); y -= 12;
        }
    }

    if (y < 80) { page = newPage(); y = drawHeader(page); }
    const disclaimer =
        "Estimación sujeta a validación técnica con curvas Liebherr, útiles/pluma, accesos y visita de obra. " +
        "Para radios >30 m o cargas >120T, la definición final se realiza con técnico comercial.";
    const discLines = wrap(disclaimer, 95);
    for (const ln of discLines) { page.drawText(ln, { x: margin, y, size: 9, font, color: rgb(0.25, 0.25, 0.25) }); y -= 12; }

    const pdfBytes = await pdfDoc.save();
    const base64 = Buffer.from(pdfBytes).toString("base64");
    const filename = `Presupuesto-${cliente.replace(/\s+/g, "_")}.pdf`;
    return { base64, filename };
}

// ---------- Tabla HTML pública ----------
function buildPublicTable(partidas: PublicRow[], subtotal: number, iva: number, total: number) {
    return `
<table style="width:100%;border-collapse:collapse;font-family:system-ui,-apple-system,Segoe UI,Roboto;font-size:14px">
  <thead>
    <tr style="background:#f3f4f6">
      <th style="text-align:left;padding:8px;border:1px solid #e5e7eb">Partida</th>
      <th style="text-align:left;padding:8px;border:1px solid #e5e7eb">Descripción</th>
      <th style="text-align:right;padding:8px;border:1px solid #e5e7eb">Ud</th>
      <th style="text-align:right;padding:8px;border:1px solid #e5e7eb">Cant.</th>
      <th style="text-align:right;padding:8px;border:1px solid #e5e7eb">P. Unit</th>
      <th style="text-align:right;padding:8px;border:1px solid #e5e7eb">Importe</th>
    </tr>
  </thead>
  <tbody>
    ${partidas.map(r => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb"><strong>${r.codigo}</strong> — ${r.partida}</td>
        <td style="padding:8px;border:1px solid #e5e7eb">${r.descripcion}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${r.ud}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${r.cantidad}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${r.punit.toFixed(2)} €</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:right"><strong>${r.importe.toFixed(2)} €</strong></td>
      </tr>`).join("")}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4" style="border:none"></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right"><strong>Subtotal</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${subtotal.toFixed(2)} €</td>
    </tr>
    <tr>
      <td colspan="4" style="border:none"></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right"><strong>IVA (21%)</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${iva.toFixed(2)} €</td>
    </tr>
    <tr>
      <td colspan="4" style="border:none"></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right"><strong>TOTAL</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-align:right"><strong>${total.toFixed(2)} €</strong></td>
    </tr>
  </tfoot>
</table>`.trim();
}

// ============================================================
// Controller
// ============================================================
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const mode = (body?.mode || "calcular") as "calcular" | "enviar";

        // ---- Entrada principal (igual que antes)
        const cliente = (body?.cliente ?? "Cliente").toString();
        const contacto = (body?.contacto ?? "").toString();
        const emailCli = (body?.email ?? "").toString();
        const obra = (body?.obra ?? "").toString();
        const ciudadRaw = (body?.ciudad ?? "").toString();
        const tipo_obra = (body?.tipo_obra ?? "").toString();

        const vigas_wt = Number(body?.vigas_wt || 0);
        const paneles_fachada = Number(body?.paneles_fachada || 0);
        const losas_alveolares = Number(body?.losas_alveolares || 0);
        const pilares = Number(body?.pilares || 0);
        const peso_max_t = Number(body?.peso_max_t || 0);
        const radio_max_m = Number(body?.radio_max_m || 0);
        const jornadasStr = (body?.jornadas ?? "1 diurna").toString();
        const grua_prevista = (body?.grua_prevista ?? "").toString();
        const trabajo_noche = (body?.trabajo_noche ?? "Diurna").toString();

        const ciudad = normalizeCity(ciudadRaw);
        const equiposN = (() => { const m = jornadasStr.match(/(^|\s)([123])\s*equip/i); return m ? Number(m[2]) : 1; })();
        const jornadasN = (() => { const m = jornadasStr.match(/(\d+)/); return m ? Math.max(1, Number(m[1])) : 1; })();
        const isNight = /nocturna/i.test(trabajo_noche) && !/festivo/i.test(trabajo_noche);
        const isHolidayNight = /nocturna/i.test(trabajo_noche) && /festivo|fin/i.test(trabajo_noche);

        // ---- Selección técnica por curvas
        let errorInfo: string | null = null;
        const classByCharts = recommendCraneClassByCharts(peso_max_t, radio_max_m);
        const requestedClass: string =
            grua_prevista && grua_prevista !== "A convenir con técnico"
                ? grua_prevista
                : classByCharts;

        const { city: supplyCity, availableHere } = pickCityForClass(ciudad, requestedClass);
        const craneHours = 8 * jornadasN;

        let crane, crew;
        try {
            crane = computeCraneCost(ciudad, requestedClass, craneHours, isNight, isHolidayNight, availableHere ? undefined : supplyCity);
            crew = computeCrewCost(equiposN, jornadasN, isNight, isHolidayNight);
        } catch (e: any) {
            errorInfo = "Fallo de cálculo: " + (e?.message || "error desconocido");
            // Fallback a valores nulos para permitir “enviar” con PDF-resumen
            crane = { cost: 0, public: 0, detail: "A convenir — error de cálculo" };
            crew = { cost: 0, public: 0, detail: "A convenir — error de cálculo", unit_public: 0, unit_ud: "jornada", unit_qty: 0 };
        }

        const coordTransporte_cost = 450;
        const coordTransporte_public = round2(coordTransporte_cost * MARKUP_MISC);
        const balizamiento_cost = 0, balizamiento_public = 0;

        const subtotal_cost = round2(crew.cost + crane.cost + coordTransporte_cost + balizamiento_cost);
        const subtotal_public = round2(crew.public + crane.public + coordTransporte_public + balizamiento_public);
        const iva_cost = round2(subtotal_cost * 0.21);
        const iva_public = round2(subtotal_public * 0.21);
        const total_cost = round2(subtotal_cost + iva_cost);
        const total_public = round2(subtotal_public + iva_public);

        // ---- Partidas públicas (para UI/PDF)
        const partidas: PublicRow[] = [
            { codigo: "01", partida: "Cuadrillas de montaje", descripcion: crew.detail, ud: crew.unit_ud, cantidad: crew.unit_qty, punit: crew.unit_public, importe: round2(crew.unit_public * crew.unit_qty) },
            { codigo: "02", partida: `Grúa ${requestedClass}`, descripcion: crane.detail, ud: "lote", cantidad: 1, punit: crane.public || 0, importe: crane.public || 0 },
            { codigo: "03", partida: "Coordinación de transporte", descripcion: "Rutas, permisos, escoltas y coordinación carga/descarga", ud: "lote", cantidad: 1, punit: coordTransporte_public, importe: coordTransporte_public },
        ];

        const html_public_table = buildPublicTable(partidas, subtotal_public, iva_public, total_public);

        // ---- OpenAI (alcance)
        const aiPrompt = `
Proyecto: ${obra || "(sin nombre)"} — Ciudad: ${ciudad}
Tipo de obra: ${tipo_obra}
Selección preliminar:
- Peso máx (pieza): ${peso_max_t} t · Radio máx: ${radio_max_m} m
- Clase grúa propuesta: ${requestedClass}
- Jornadas: ${jornadasStr} · Equipos: ${equiposN}
- Elementos: vigas=${vigas_wt}, paneles=${paneles_fachada}, losas=${losas_alveolares}, pilares=${pilares}

Redacta alcance/supuestos conservadores (orientativo, validar curvas Liebherr, útiles/pluma, accesos y visita).`.trim();
        const aiText = await askOpenAI(aiPrompt);

        // ---- PDF (público) — siempre generamos, aunque haya error, para poder enviar/descargar
        const tituloPDF = errorInfo
            ? "Resumen de solicitud — (en estudio técnico)"
            : "Presupuesto técnico orientativo (no vinculante)";
        const { base64: pdfBase64, filename } = await generarPDFPublico({
            cliente, contacto, emailCli, ciudad, obra, tipo_obra,
            partidas: errorInfo ? [] : partidas,
            subtotal: errorInfo ? 0 : subtotal_public,
            iva: errorInfo ? 0 : iva_public,
            total: errorInfo ? 0 : total_public,
            ai: aiText,
            titulo: tituloPDF,
        });

        // ======= MODO "CALCULAR": NO ENVÍES CORREOS =======
        if (mode === "calcular") {
            return Response.json({
                ok: true,
                errorInfo,
                seleccion: {
                    clase_por_curvas: requestedClass,
                    criterio: "capacidad(curva, radio) ≥ 1.1*Peso × 1.3 (útiles + colchón)",
                },
                partidas: errorInfo ? [] : partidas,
                resumen: errorInfo ? null : { subtotal_public, iva_public, total_public },
                html_public_table,
                pdfBase64,
                filename,
                meta: { ciudad, crane_city: supplyCity, available_here: availableHere }
            });
        }

        // ======= MODO "ENVIAR": ENVÍA CORREOS CON PDF =======
        // Requiere: emailCli (cliente) y MAIL_TO (interno)
        const htmlCliente = `
<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;color:#0a0a0a">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
    <div style="width:38px;height:38px;background:#FACC15;border-radius:10px;display:grid;place-items:center;font-weight:900;color:#0a0a0a">MP</div>
    <div>
      <div style="font-size:12px;font-weight:800;letter-spacing:.08em;color:#F59E0B">MONTAJE DE PREFABRICADOS</div>
      <div style="font-size:11px;color:#6b7280">Estructuras · Transporte · Grúas</div>
    </div>
  </div>
  <p>Hola ${contacto || cliente},</p>
  <p>Gracias por contactar con nosotros. Adjuntamos tu <strong>${errorInfo ? "resumen de solicitud" : "presupuesto orientativo"}</strong> en PDF.</p>
  <p>Un técnico de obra se pondrá en contacto contigo a la mayor brevedad para afinar detalles.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p style="font-size:12px;color:#6b7280">Montajedeprefabricados.com · Coordinación con Ibercarga · Atención: Lun–Vie 08:00–19:00</p>
</div>`.trim();

        const htmlInterno = `
<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;color:#0a0a0a">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
    <div style="width:38px;height:38px;background:#FACC15;border-radius:10px;display:grid;place-items:center;font-weight:900;color:#0a0a0a">MP</div>
    <div>
      <div style="font-size:12px;font-weight:800;letter-spacing:.08em;color:#F59E0B">MONTAJE DE PREFABRICADOS</div>
      <div style="font-size:11px;color:#6b7280">Estructuras · Transporte · Grúas</div>
    </div>
  </div>
  <p><strong>(Copia empresa)</strong></p>
  ${errorInfo ? `<p style="color:#DC2626"><strong>Aviso:</strong> ${errorInfo}</p>` : ""}
  <p><strong>Cliente:</strong> ${cliente} — <strong>Contacto:</strong> ${contacto} — <strong>Email:</strong> ${emailCli}</p>
  <p><strong>Ciudad:</strong> ${ciudad}${availableHere ? "" : ` (grúa desde ${supplyCity})`} — <strong>Obra:</strong> ${obra || "-"}</p>
  <p><strong>Peso/Radio:</strong> ${peso_max_t} t / ${radio_max_m} m — <strong>Clase sugerida:</strong> ${requestedClass}</p>
  ${!errorInfo ? `
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
  <p><strong>Costes:</strong> Cuadrillas ${crew.cost.toFixed(2)} €, Grúa ${crane.cost ? crane.cost.toFixed(2) + " €" : "A convenir"}, Coord. ${coordTransporte_cost.toFixed(2)} €</p>
  <p><strong>PVP:</strong> Subtotal ${subtotal_public.toFixed(2)} €, IVA ${iva_public.toFixed(2)} €, Total ${total_public.toFixed(2)} €</p>` : ""}
</div>`.trim();

        try {
            if (emailCli) await sendEmail({ to: emailCli, subject: errorInfo ? `Resumen de solicitud — ${cliente}` : `Presupuesto orientativo — ${cliente}`, html: htmlCliente, attachments: [{ filename, content: pdfBase64 }] });
            await sendEmail({ to: MAIL_TO, subject: errorInfo ? `[Interno] Resumen (fallo cálculo) — ${cliente}` : `[Interno] Descompuesto — ${cliente} (${ciudad})`, html: htmlInterno, attachments: [{ filename, content: pdfBase64 }] });
        } catch (e: any) {
            return new Response(JSON.stringify({ ok: false, error: "Fallo enviando correos: " + (e?.message || "desconocido") }), { status: 500 });
        }

        return Response.json({ ok: true });
    } catch (e: any) {
        console.error("[/api/presupuesto] ERROR:", e?.message || e);
        return new Response(JSON.stringify({ ok: false, error: e?.message || "Error inesperado" }), { status: 500 });
    }
}
