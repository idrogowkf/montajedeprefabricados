import {NextResponse} from "next/server";
import {parseMetricEvent} from "@/lib/catalog/event-validation";

export async function POST(request: Request) {
  try {
    const event = parseMetricEvent(await request.json());
    const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ok: true, stored: false}, {status: 202});
    const response = await fetch(`${url}/rest/v1/product_events`, {method: "POST", headers: {apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal"}, body: JSON.stringify({event_type: event.type, product_slug: event.productSlug}), cache: "no-store"});
    if (!response.ok) throw new Error("No se pudo registrar la métrica");
    return NextResponse.json({ok: true, stored: true}, {status: 201});
  } catch (error) {
    return NextResponse.json({ok: false, error: error instanceof Error ? error.message : "Evento no válido"}, {status: 400});
  }
}
