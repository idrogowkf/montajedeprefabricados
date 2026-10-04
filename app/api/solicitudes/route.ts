import {NextResponse} from "next/server";
import {notifyRfq} from "@/lib/rfq/email";
import {SupabaseRfqRepository} from "@/lib/rfq/repository";
import {submitRfq} from "@/lib/rfq/service";
import {parseRfqRequest} from "@/lib/rfq/validation";

export async function POST(request: Request) {
  try {
    const input = parseRfqRequest(await request.json());
    const result = await submitRfq(input, new SupabaseRfqRepository(), notifyRfq);
    return NextResponse.json({ok: true, ...result}, {status: result.duplicate ? 200 : 201});
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const configuration = message.includes("pendiente de activar");
    const invalid = /válid|Completa|Añade|Demasiados/.test(message);
    return NextResponse.json({ok: false, error: message}, {status: configuration ? 503 : invalid ? 400 : 500});
  }
}
