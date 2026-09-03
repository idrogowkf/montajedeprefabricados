import { processSteps } from "@/data/v21-content";

export default function ProcessSection() {
  return <section className="v21-section" id="metodo"><div className="shell process-grid"><div className="kicker mono">03 — Método</div><div className="process-copy"><h2>Precisión en<br />cada <span className="red">fase.</span></h2><p>Ordenamos decisiones y dependencias para que la planificación pueda convertirse en una secuencia ejecutable.</p><div className="timeline">{processSteps.map(([number,title,tag]) => <div className="time-row" key={number}><span className="no mono">{number}</span><b>{title}</b><span>{tag}</span></div>)}</div></div></div></section>;
}
