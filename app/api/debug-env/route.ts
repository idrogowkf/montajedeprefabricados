import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        has_RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
        RESEND_API_KEY_prefix: process.env.RESEND_API_KEY?.slice(0, 8) || null,
        MAIL_FROM: process.env.MAIL_FROM || null,
        MAIL_TO: process.env.MAIL_TO || null,
        cwd: process.cwd(), // para confirmar desde dónde se levantó el server
    });
}
