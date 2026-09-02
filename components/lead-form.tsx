
'use client'
import React, { useState } from 'react'

export default function LeadForm(){
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState<string|null>(null)
  async function submit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true); setOk(null)
    try {
      const fd = new FormData(e.currentTarget)
      const payload = Object.fromEntries(fd.entries())
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      const response = await res.json() as {ok?:boolean;error?:string}
      setOk(res.ok && response.ok ? 'Solicitud enviada' : (response.error || 'No se pudo enviar'))
    } catch {
      setOk('Error de red. Reintenta en unos segundos.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="nombre" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-yellow-400" placeholder="Nombre" required />
        <input name="empresa" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-yellow-400" placeholder="Empresa" />
      </div>
      <input name="email" type="email" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-yellow-400" placeholder="Email" required />
      <textarea name="mensaje" rows={6} className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-yellow-400" placeholder="Ubicación, elementos, tonelajes, radios, planos, fechas" required />
      <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300">
        {loading ? 'Enviando…' : 'Enviar'}
      </button>
      {ok && <p className="text-sm text-neutral-300">{ok}</p>}
      <p className="text-xs text-neutral-500">Al enviar aceptas nuestra <a className="underline hover:text-neutral-300" href="#">Política de Privacidad</a>.</p>
    </form>
  )
}
