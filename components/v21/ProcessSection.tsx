"use client";

import { useState } from "react";
import { processSteps } from "@/data/v21-content";

export default function ProcessSection() {
  const [open,setOpen] = useState(0);
  return <section className="v21-section" id="metodo"><div className="shell process-grid"><div className="kicker mono">03 — Método</div><div className="process-copy"><h2>Precisión en<br />cada <span className="red">fase.</span></h2><p>Ordenamos decisiones y dependencias para que la planificación pueda convertirse en una secuencia ejecutable.</p><div className="timeline">{processSteps.map((step,index) => <div className="time-item" key={step.number}><button className="time-row" type="button" aria-expanded={open===index} aria-controls={`phase-${step.number}`} onClick={()=>setOpen(open===index ? -1 : index)}><span className="no mono">{step.number}</span><b>{step.title}</b><span>{step.tag} {open===index ? "−" : "+"}</span></button><div className="phase-detail" id={`phase-${step.number}`} hidden={open!==index}><p>{step.summary}</p><div><strong>Datos de partida</strong><ul>{step.inputs.map(item=><li key={item}>{item}</li>)}</ul></div><div><strong>Resultado de la fase</strong><p>{step.output}</p></div></div></div>)}</div></div></div></section>;
}
