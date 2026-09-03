"use client";

import { FormEvent, useState } from "react";
import { technicalTopics, type TechnicalTopicKey } from "@/data/v21-content";

type Message = { text: string; mine?: boolean };

export default function TechnicalCenter() {
  const [active, setActive] = useState<TechnicalTopicKey>("grua");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ text: "Cuéntame qué vas a montar. Con pieza, peso aproximado, ubicación y restricciones podemos ordenar la información necesaria para estudiar la operación." }]);
  const selectTopic = (key: TechnicalTopicKey) => { setActive(key); setMessages((items) => [...items, { text: technicalTopics[key].answer }]); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = question.trim();
    if (!clean) return;
    const lower = clean.toLowerCase();
    const key: TechnicalTopicKey = lower.match(/grúa|grua|radio|ton/) ? "grua" : lower.match(/plano|document/) ? "planos" : lower.match(/panel|fachada/) ? "paneles" : lower.match(/acceso|transport/) ? "logistica" : "secuencia";
    setMessages((items) => [...items, { text: clean, mine: true }, { text: technicalTopics[key].answer }]);
    setQuestion("");
  };
  return <section className="v21-section center" id="centro-tecnico"><div className="shell"><div className="section-head"><div><div className="kicker mono">06 — Centro Técnico</div><h2>Pregunta antes<br />de <span className="red">improvisar.</span></h2></div><p>Orientación preliminar para identificar la información que condiciona la planificación.</p></div><div className="center-grid"><aside className="center-nav"><div className="kicker mono">Montaje Prefabricado / Technical Desk</div><h2>Resolver dudas también es planificar.</h2><p>Selecciona un tema para revisar sus datos de partida.</p><div className="topic-list">{Object.entries(technicalTopics).map(([key,topic]) => <button type="button" className={`topic${active === key ? " active" : ""}`} aria-pressed={active === key} onClick={() => selectTopic(key as TechnicalTopicKey)} key={key}>{topic.label}</button>)}</div><a className="v21-btn redbtn center-continue" href="#preestudio">Continuar con preestudio →</a></aside><div className="center-main"><div className="chat-head"><b>Asistente de preestudio</b><span className="mono">Orientación · no vinculante</span></div><div className="chat" aria-live="polite">{messages.map((message,index) => <div className={`bubble${message.mine ? " me" : ""}`} key={`${index}-${message.text}`}>{!message.mine && <label className="mono">Montaje Prefabricado</label>}{message.text}</div>)}</div><form className="ask" onSubmit={submit}><label className="sr-only" htmlFor="technical-question">Consulta técnica</label><input id="technical-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ej.: viga de 55 t a 18 m de radio en Madrid..." autoComplete="off" /><button type="submit" aria-label="Enviar consulta">→</button></form></div></div></div></section>;
}
