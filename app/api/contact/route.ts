import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (body.website) return NextResponse.json({ ok: true });
        const nombre = clean(body.nombre, 120);
        const empresa = clean(body.empresa, 160);
        const email = clean(body.email, 200).toLowerCase();
        const telefono = clean(body.telefono, 80);
        const mensaje = clean(body.mensaje, 4000);
        const origen = clean(body.origen, 100) || "landing";

        if (!nombre || !email || !mensaje) {
            return NextResponse.json({ ok: false, error: "Completa nombre, correo y mensaje." }, { status: 400 });
        }
        if (!emailPattern.test(email)) return NextResponse.json({ ok: false, error: "Introduce un correo electrónico válido." }, { status: 400 });
        if (!process.env.RESEND_API_KEY) return NextResponse.json({ ok: false, error: "El servicio de contacto no está disponible." }, { status: 503 });

        // Enviar correo con Resend
        const data = {
            from: process.env.MAIL_FROM || "Ofertas <ofertas@montajedeprefabricados.com>",
            to: process.env.MAIL_TO || "ofertas@montajedeprefabricados.com",
            subject: `Nuevo contacto desde ${origen}`,
            replyTo: email,
            html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(empresa || "(sin especificar)")}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(telefono || "(sin especificar)")}</p>
        <p><strong>Mensaje:</strong><br/>${escapeHtml(mensaje).replace(/\n/g, "<br/>")}</p>
      `,
        };

        const resend = new Resend(process.env.RESEND_API_KEY);
        const result = await resend.emails.send(data);

        if (result.error) {
            console.error("Error al enviar correo:", result.error);
            return NextResponse.json({ ok: false, error: "No se pudo entregar el mensaje." }, { status: 502 });
        }

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        console.error("Error general en /api/contact:", err);
        return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "No se pudo enviar el mensaje." }, { status: 500 });
    }
}
