import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nombre, empresa, email, mensaje, origen } = body;

        if (!nombre || !email || !mensaje) {
            return NextResponse.json({ ok: false, error: "Faltan campos obligatorios" });
        }

        // Enviar correo con Resend
        const data = {
            from: process.env.MAIL_FROM || "Ofertas <ofertas@montajedeprefabricados.com>",
            to: process.env.MAIL_TO || "ofertas@montajedeprefabricados.com",
            subject: `Nuevo contacto desde ${origen || "landing"}`,
            reply_to: email,
            html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Empresa:</strong> ${empresa || "(sin especificar)"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${mensaje}</p>
      `,
        };

        const result = await resend.emails.send(data);

        if (result.error) {
            console.error("Error al enviar correo:", result.error);
            return NextResponse.json({ ok: false, error: result.error });
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("Error general en /api/contact:", err);
        return NextResponse.json({ ok: false, error: err.message });
    }
}
