"use client";

import Image from "next/image";
import { useState } from "react";
import { capabilities } from "@/data/v21-content";

export default function CapabilitiesSection() {
  const [active, setActive] = useState(0);
  return <section className="v21-section dark" id="capacidades"><div className="shell"><div className="section-head"><div><div className="kicker mono">02 — Capacidades</div><h2>Una operación.<br /><span className="red">Cinco disciplinas.</span></h2></div><p>El montaje se decide en la interfaz entre pieza, grúa, transporte, emplazamiento y equipo humano.</p></div><div className="capabilities-layout"><div className="services">{capabilities.map((service,index) => <button type="button" aria-pressed={active === index} className={`service-row${active === index ? " active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} key={service.title}><span className="service-num mono">{String(index + 1).padStart(2,"0")}</span><span className="service-title">{service.title}</span><span className="service-desc">{service.description}</span><span className="service-arrow">↗</span></button>)}</div><div className="capability-media" aria-live="polite"><Image src={capabilities[active].image} alt={capabilities[active].title} fill sizes="(max-width: 820px) 100vw, 34vw" /></div></div></div></section>;
}
