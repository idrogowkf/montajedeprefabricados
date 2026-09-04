import { formatSpanishDate } from "./date-input";
import { sanitizeText, type PreStudyData } from "./prestudy";

type EmailContent = { html: string; text: string };
const CONTACT_EMAIL = "ofertas@montajedeprefabricados.com";
const CONTACT_PHONE = "+34 624 473 123";

const escapeHtml = (value: unknown) => sanitizeText(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const display = (value: unknown) => escapeHtml(value) || "—";

function projectRows(data: PreStudyData) {
  return [
    ["Tipología",data.projectType],["Ubicación",data.location],["Dirección",data.address],
    ["Fecha prevista",formatSpanishDate(data.date) || data.date],["Piezas",data.pieces],
    ["Peso máximo",data.maxWeight],["Longitud máxima",data.maxLength],["Altura de colocación",data.placementHeight],
    ["Necesidades",data.needs.join(", ") || "Por definir"],["Acceso",data.access],["Zona de acopio",data.storageArea],
    ["Condicionantes",data.constraints],["Notas de piezas",data.pieceNotes],["Observaciones",data.message],
    ["Documentación externa",data.externalUrl]
  ] as const;
}

function shell(title: string, reference: string, intro: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#eceae6;color:#111;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:680px;background:#fff;border-collapse:collapse"><tr><td style="background:#08090a;padding:24px"><table role="presentation"><tr><td style="background:#ef233c;color:#fff;font-weight:900;font-size:22px;padding:12px">MP</td><td style="color:#fff;font-weight:800;font-size:16px;line-height:1.05;padding-left:14px">MONTAJE<br>PREFABRICADO</td></tr></table></td></tr><tr><td style="padding:34px"><div style="color:#ef233c;font-size:12px;font-weight:800;letter-spacing:.08em">${display(reference)}</div><h1 style="font-size:30px;line-height:1.05;margin:10px 0 14px">${title}</h1><p style="color:#555;line-height:1.6">${intro}</p>${body}</td></tr><tr><td style="background:#08090a;color:#fff;padding:24px;font-size:13px;line-height:1.7"><strong>MONTAJE PREFABRICADO</strong><br><a style="color:#fff" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> · <a style="color:#fff" href="tel:+34624473123">${CONTACT_PHONE}</a><br><a style="color:#ef233c" href="https://wa.me/34624473123">WhatsApp</a> · <a style="color:#fff" href="https://montajedeprefabricados.com">montajedeprefabricados.com</a></td></tr></table></td></tr></table></body></html>`;
}

function rowsHtml(rows: readonly (readonly [string, unknown])[]) {
  return `<table role="presentation" width="100%" style="border-collapse:collapse;margin-top:24px">${rows.map(([label,value])=>`<tr><th align="left" style="width:38%;padding:10px 8px;border-bottom:1px solid #ddd;font-size:12px">${label}</th><td style="padding:10px 8px;border-bottom:1px solid #ddd;font-size:13px">${display(value)}</td></tr>`).join("")}</table>`;
}

function textRows(rows: readonly (readonly [string, unknown])[]) { return rows.map(([label,value])=>`${label}: ${sanitizeText(value) || "—"}`).join("\n"); }

export function renderAdminPreStudyEmail(data: PreStudyData, reference: string): EmailContent {
  const contact = [["Nombre",data.name],["Empresa",data.company],["Email",data.email],["Teléfono",data.phone]] as const;
  const docs = data.documents.length ? `<h2 style="margin-top:28px">Documentación</h2><ul>${data.documents.map(file=>`<li><a href="${encodeURI(file.url)}">${display(file.name)}</a> · ${(file.size/1024/1024).toFixed(1)} MB</li>`).join("")}</ul>` : `<p style="margin-top:24px;color:#666">Sin archivos adjuntos.</p>`;
  const body = `<h2 style="font-size:18px;margin-top:28px">Contacto</h2>${rowsHtml(contact)}<h2 style="font-size:18px;margin-top:28px">Datos del estudio</h2>${rowsHtml(projectRows(data))}${docs}`;
  const text = `NUEVO PREESTUDIO DE MONTAJE\nReferencia: ${reference}\n\nCONTACTO\n${textRows(contact)}\n\nDATOS DEL ESTUDIO\n${textRows(projectRows(data))}`;
  return {html:shell("Nuevo preestudio de montaje",reference,"La solicitud reúne los datos aportados por el cliente para iniciar la revisión técnica.",body),text};
}

export function renderClientPreStudyEmail(data: PreStudyData, reference: string): EmailContent {
  const rows = [["Nombre",data.name],["Empresa",data.company],["Email",data.email],["Teléfono",data.phone],...projectRows(data)] as const;
  const body = `<div style="border-left:4px solid #ef233c;padding:14px 18px;margin:24px 0;background:#f7f5f1"><strong>Siguiente paso</strong><p style="margin:8px 0 0;line-height:1.5">Revisaremos la información técnica y contactaremos contigo. Si falta algún dato, podrá completarse durante la revisión.</p></div><h2 style="font-size:18px">Resumen enviado</h2>${rowsHtml(rows)}`;
  const text = `HEMOS RECIBIDO TU PREESTUDIO\nReferencia: ${reference}\n\nRevisaremos la información técnica y contactaremos contigo. Los datos pendientes podrán completarse durante la revisión.\n\n${textRows(rows)}\n\n${CONTACT_EMAIL} · ${CONTACT_PHONE} · https://wa.me/34624473123`;
  return {html:shell("Hemos recibido tu preestudio",reference,"Conserva esta referencia para completar información o consultar tu solicitud.",body),text};
}
