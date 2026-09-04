"use client";

import { FormEvent, useRef, useState } from "react";
import { initialPreStudyData, validateStep, type PreStudyData } from "@/lib/prestudy";
import ContactStep from "./ContactStep";
import DocumentsStep from "./DocumentsStep";
import NeedsStep from "./NeedsStep";
import PiecesStep from "./PiecesStep";
import ProjectTypeStep from "./ProjectTypeStep";
import SiteStep from "./SiteStep";
import Stepper from "./Stepper";

export default function PreStudy() {
  const [step,setStep] = useState(1);
  const [data,setData] = useState<PreStudyData>(initialPreStudyData);
  const [errors,setErrors] = useState<Record<string,string>>({});
  const [status,setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [reference,setReference] = useState("");
  const [message,setMessage] = useState("");
  const main = useRef<HTMLDivElement>(null);
  const update = (patch: Partial<PreStudyData>) => { setData((current) => ({...current,...patch})); setErrors({}); };
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => {main.current?.focus(); main.current?.scrollIntoView({behavior:"smooth",block:"center"});}); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const currentErrors = validateStep(step,data);
    if (Object.keys(currentErrors).length) {setErrors(currentErrors);return;}
    if (step < 6) {move(step + 1);return;}
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/prestudy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "No se pudo enviar el preestudio.");
      setReference(result.reference); setStatus("success");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "No se pudo enviar el preestudio."); setStatus("error"); }
  };
  if (status === "success") return <section className="study" id="preestudio"><div className="shell success-panel" role="status"><div className="kicker mono">Preestudio completado</div><h2>La solicitud ya tiene contexto técnico.</h2><p>Referencia <strong>{reference}</strong>.</p><p>{data.email ? "Recibirás este código y un resumen de los datos del estudio en tu correo. Consérvalo para completar información o consultar el estado de la solicitud." : "Conserva este código: identificará la solicitud cuando contactemos contigo por teléfono."}</p><button className="v21-btn darkbtn" type="button" onClick={() => {setData(initialPreStudyData);setStep(1);setStatus("idle");}}>Nuevo preestudio</button></div></section>;
  return <section className="study" id="preestudio"><div className="shell"><div className="section-head"><div><div className="kicker mono">04 — Conversión principal</div><h2>Estudio de montaje<br /><span className="red">interactivo.</span></h2></div><p>Entrega la información que ya tienes. Puedes introducir datos, subir planos o pegar un enlace con documentación pesada.</p></div><div className="study-shell"><aside className="study-intro"><div className="kicker mono">Tu proyecto empieza aquí</div><h2>Cuéntanos<br />la obra.<br /><span className="red">Nosotros</span><br />ordenamos<br />los datos.</h2><p>No necesitas conocer todavía todos los medios ni dimensiones.</p><div className="study-benefits"><div className="study-benefit"><span className="dot" />Sin presupuesto automático ficticio</div><div className="study-benefit"><span className="dot" />Documentación en el mismo flujo</div><div className="study-benefit"><span className="dot" />Enlace externo para archivos pesados</div></div><div className="study-mini mono">Preestudio técnico · no vinculante</div></aside><form className="study-main" onSubmit={submit} noValidate><div ref={main} tabIndex={-1}><Stepper step={step} />{step === 1 && <ProjectTypeStep data={data} update={update} error={errors.projectType} />}{step === 2 && <PiecesStep data={data} update={update} />}{step === 3 && <SiteStep data={data} update={update} error={errors.location} />}{step === 4 && <NeedsStep data={data} update={update} />}{step === 5 && <DocumentsStep data={data} update={update} error={errors.externalUrl} />}{step === 6 && <ContactStep data={data} update={update} errors={errors} />}</div><div aria-live="polite">{status === "error" && <p className="field-error" role="alert">{message}</p>}</div><div className="study-actions"><button className={`v21-btn darkbtn back${step > 1 ? " show" : ""}`} type="button" onClick={() => move(step - 1)}>← Anterior</button><button className="v21-btn redbtn" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : step === 6 ? "Enviar para preestudio →" : "Siguiente →"}</button></div></form><aside className="study-side"><div className="tech-card"><div className="tech-status"><b>Centro técnico</b><span className="online">online</span></div><h4>No necesitas resolverlo todo ahora</h4><p>El preestudio identifica la información pendiente sin obligarte a inventarla.</p><div className="quick"><a href="#centro-tecnico">¿Qué datos necesito para una grúa?</a><a href="#centro-tecnico">No conozco el peso exacto</a><a href="#centro-tecnico">Solo tengo planos</a></div></div><div className="contact-card"><h4>Contacto alternativo</h4><div className="contact-row"><b>Email</b><span>ofertas@montajesprefabricados.com</span></div><div className="contact-row"><b>Teléfono</b><span>+34 624 473 123</span></div><div className="contact-row"><b>WhatsApp</b><a href="https://wa.me/34624473123">Abrir conversación</a></div></div><div className="security-note">Los documentos se utilizan únicamente para estudiar la solicitud.</div></aside></div></div></section>;
}
