import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ACCEPTED_EXTENSIONS, sanitizeText, validateStep, type PreStudyData } from "@/lib/prestudy";
import { renderAdminPreStudyEmail, renderClientPreStudyEmail } from "@/lib/prestudy-email";

const attempts = new Map<string,{count:number;reset:number}>();
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
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.MAIL_FROM || "Montaje Prefabricado <ofertas@montajesprefabricados.com>";
    const to = process.env.MAIL_TO || "ofertas@montajesprefabricados.com";
    const adminEmail = renderAdminPreStudyEmail(raw,id);
    const admin = await resend.emails.send({from,to,replyTo:raw.email || undefined,subject:`Nuevo preestudio de montaje — ${sanitizeText(raw.location,80)} / ${sanitizeText(raw.projectType,80)}`,...adminEmail});
    if (admin.error) throw new Error(admin.error.message);
    if (raw.email) {
      const clientEmail = renderClientPreStudyEmail(raw,id);
      const client = await resend.emails.send({from,to:raw.email,subject:`Preestudio recibido — ${id}`,...clientEmail});
      if (client.error) throw new Error(client.error.message);
    }
    return NextResponse.json({ok:true,reference:id});
  } catch (cause) {
    console.error("[/api/prestudy]",cause);
    return NextResponse.json({ok:false,error:cause instanceof Error ? cause.message : "No se pudo enviar el preestudio."},{status:500});
  }
}
