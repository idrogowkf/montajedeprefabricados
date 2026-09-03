import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ACCEPTED_EXTENSIONS, sanitizeText, validateStep, type PreStudyData } from "@/lib/prestudy";

const attempts = new Map<string,{count:number;reset:number}>();
const escapeHtml = (value: unknown) => sanitizeText(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const reference = () => `MP-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g,"").slice(0,6).toUpperCase()}`;

function rateLimited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now(); const current = attempts.get(key);
  if (!current || current.reset < now) {attempts.set(key,{count:1,reset:now + 15 * 60_000});return false;}
  current.count += 1; return current.count > 5;
}

export async function POST(request: Request) {
  if (rateLimited(request)) return NextResponse.json({ok:false,error:"Demasiadas solicitudes. Inténtalo de nuevo más tarde."},{status:429});
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ok:false,error:"El servicio de envío no está configurado."},{status:503});
  try {
    const raw = await request.json() as PreStudyData;
    if (raw.website) return NextResponse.json({ok:true,reference:reference()});
    const errors = {...validateStep(1,raw),...validateStep(3,raw),...validateStep(5,raw),...validateStep(6,raw)};
    if (Object.keys(errors).length) return NextResponse.json({ok:false,error:Object.values(errors)[0]},{status:400});
    if (!Array.isArray(raw.documents) || raw.documents.length > 10) return NextResponse.json({ok:false,error:"Documentación no válida."},{status:400});
    for (const document of raw.documents) {
      const extension = document.name.split(".").pop()?.toLowerCase() || "";
      if (!ACCEPTED_EXTENSIONS.includes(extension) || !/^https:\/\//.test(document.url) || document.size > 25 * 1024 * 1024) return NextResponse.json({ok:false,error:"Referencia de archivo no válida."},{status:400});
    }
    const id = reference();
    const safe = Object.fromEntries(Object.entries(raw).filter(([key]) => key !== "documents").map(([key,value]) => [key,Array.isArray(value) ? value.map(escapeHtml).join(", ") : escapeHtml(value)]));
    const files = raw.documents.map((document) => `<li><a href="${encodeURI(document.url)}">${escapeHtml(document.name)}</a> — ${(document.size / 1024 / 1024).toFixed(1)} MB</li>`).join("") || "<li>Sin archivos adjuntos</li>";
    const rows = [["Referencia",id],["Contacto",safe.name],["Empresa",safe.company || "—"],["Email",safe.email || "—"],["Teléfono",safe.phone || "—"],["Ubicación",safe.location],["Fecha",safe.date || "—"],["Tipología",safe.projectType],["Piezas",safe.pieces || "—"],["Peso máximo",safe.maxWeight || "—"],["Longitud máxima",safe.maxLength || "—"],["Altura",safe.placementHeight || "—"],["Necesidades",safe.needs || "Por definir"],["Acceso",safe.access],["Acopio",safe.storageArea],["Condicionantes",safe.constraints || "—"],["Observaciones",safe.message || "—"],["Enlace externo",safe.externalUrl || "—"]];
    const html = `<div style="font-family:Arial,sans-serif;color:#111"><h1>Nuevo preestudio de montaje</h1><table style="border-collapse:collapse">${rows.map(([label,value]) => `<tr><th style="text-align:left;padding:7px;border-bottom:1px solid #ddd">${label}</th><td style="padding:7px;border-bottom:1px solid #ddd">${value}</td></tr>`).join("")}</table><h2>Documentación</h2><ul>${files}</ul></div>`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.MAIL_FROM || "Montaje Prefabricado <ofertas@montajesprefabricados.com>";
    const to = process.env.MAIL_TO || "ofertas@montajesprefabricados.com";
    const admin = await resend.emails.send({from,to,replyTo:raw.email || undefined,subject:`Nuevo preestudio de montaje — ${sanitizeText(raw.location,80)} / ${sanitizeText(raw.projectType,80)}`,html});
    if (admin.error) throw new Error(admin.error.message);
    if (raw.email) {
      const client = await resend.emails.send({from,to:raw.email,subject:`Preestudio recibido — ${id}`,html:`<div style="font-family:Arial,sans-serif;color:#111"><h1>Hemos recibido tu preestudio</h1><p>Referencia: <strong>${id}</strong></p><p>Revisaremos la información técnica y contactaremos contigo.</p></div>`});
      if (client.error) throw new Error(client.error.message);
    }
    return NextResponse.json({ok:true,reference:id});
  } catch (cause) {
    console.error("[/api/prestudy]",cause);
    return NextResponse.json({ok:false,error:cause instanceof Error ? cause.message : "No se pudo enviar el preestudio."},{status:500});
  }
}
