"use client";

import {FormEvent, useEffect, useState} from "react";
import {CART_KEY, type CartLine, readCart} from "./rfq-cart";

export function RfqForm() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [status, setStatus] = useState<{kind: "idle" | "sending" | "error" | "success"; message?: string}>({kind: "idle"});
  useEffect(() => setLines(readCart()), []);
  const update = (slug: string, quantity: number) => { const next = quantity < 1 ? lines.filter((line) => line.slug !== slug) : lines.map((line) => line.slug === slug ? {...line, quantity: Math.min(999, quantity)} : line); setLines(next); localStorage.setItem(CART_KEY, JSON.stringify(next)); };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus({kind: "sending"});
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("/api/solicitudes", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...payload, idempotencyKey: crypto.randomUUID(), items: lines.map(({slug, quantity}) => ({slug, quantity}))})});
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "No se pudo enviar");
      localStorage.removeItem(CART_KEY); setLines([]); setStatus({kind: "success", message: `Solicitud ${result.reference} registrada. Te responderemos tras confirmar precio y disponibilidad.`});
    } catch (error) { setStatus({kind: "error", message: error instanceof Error ? error.message : "No se pudo enviar"}); }
  }
  return <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
    <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6"><h2 className="text-xl font-black">Datos de empresa</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">
      <Field name="companyName" label="Razón social *" required /><Field name="nif" label="NIF / CIF" /><Field name="contactName" label="Persona de contacto *" required /><Field name="email" label="Correo *" type="email" required /><Field name="phone" label="Teléfono" type="tel" /><Field name="deliveryLocation" label="Localidad de entrega" /><label className="sm:col-span-2 text-sm font-bold">Observaciones<textarea name="notes" rows={4} className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 p-3 font-normal" /></label>
    </div></section>
    <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6"><h2 className="text-xl font-black">Productos solicitados</h2><div className="mt-5 space-y-4">{lines.map((line) => <div key={line.slug} className="grid grid-cols-[1fr_5rem] gap-3 border-b border-white/10 pb-4"><div><strong className="block text-sm">{line.name}</strong><span className="text-xs text-neutral-500">por {line.unit}</span></div><input aria-label={`Cantidad de ${line.name}`} type="number" min="0" max="999" value={line.quantity} onChange={(event) => update(line.slug, Number(event.target.value))} className="rounded-lg bg-neutral-950 px-2 text-center" /></div>)}{!lines.length && <p className="text-sm text-neutral-400">La cesta está vacía. Vuelve al catálogo para añadir productos.</p>}</div><p className="mt-6 text-xs leading-5 text-neutral-400">Al enviar solicitas una oferta no vinculante. Confirmaremos precio, disponibilidad, documentación y portes antes de cualquier contratación.</p><button disabled={!lines.length || status.kind === "sending"} className="mt-5 min-h-14 w-full rounded-xl bg-yellow-400 px-5 font-black text-neutral-950 disabled:opacity-40">{status.kind === "sending" ? "Registrando…" : "Solicitar precio y disponibilidad"}</button>{status.message && <p role="status" className={`mt-4 rounded-xl p-3 text-sm ${status.kind === "success" ? "bg-emerald-400/10 text-emerald-200" : "bg-red-400/10 text-red-200"}`}>{status.message}</p>}</section>
  </form>;
}

function Field({name, label, type = "text", required = false}: {name: string; label: string; type?: string; required?: boolean}) { return <label className="text-sm font-bold">{label}<input name={name} type={type} required={required} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 font-normal" /></label>; }
