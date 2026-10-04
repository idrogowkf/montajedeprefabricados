import {Resend} from "resend";
import type {RfqRequest} from "./types";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"}[char]!));

export async function notifyRfq(input: RfqRequest, reference: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Servicio de correo no configurado");
  const resend = new Resend(key);
  return resend.emails.send({from: process.env.MAIL_FROM || "Solicitudes <ofertas@montajedeprefabricados.com>", to: process.env.MAIL_TO || "ofertas@montajedeprefabricados.com", replyTo: input.email, subject: `${reference} · nueva solicitud de ${input.companyName}`, html: `<h1>Nueva solicitud ${escapeHtml(reference)}</h1><p><strong>Empresa:</strong> ${escapeHtml(input.companyName)}</p><p><strong>Contacto:</strong> ${escapeHtml(input.contactName)} · ${escapeHtml(input.email)}</p><p><strong>Productos:</strong> ${input.items.length}</p><p>Revísala en el centro de operaciones.</p>`});
}
