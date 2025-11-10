
'use client'
import React, { useState } from 'react'

export default function Calculator(){
  const [loading, setLoading] = useState(false)
  const [out, setOut] = useState<any>(null)
  async function estimate(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget as HTMLFormElement)
    const payload = Object.fromEntries(fd.entries())
    const res = await fetch('/api/calc', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const j = await res.json(); setOut(j); setLoading(false)
  }
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-lg font-semibold text-neutral-100">Calculadora IA de Montaje</h3>
      <p className="mt-1 text-sm text-neutral-400">Introduce datos clave y obtén una estimación orientativa.</p>
      <form onSubmit={estimate} className="mt-4 grid gap-3">
        <input name="ciudad" placeholder="Ciudad" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
        <input name="elementos" placeholder="Elementos (vigas, paneles, losas…)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
        <input name="tonelajes" placeholder="Tonelajes (ej. 45T, 70T)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
        <input name="radios" placeholder="Radios de grúa (m)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
        <input name="plazo" placeholder="Plazo objetivo (días/noches)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
        <textarea name="observaciones" rows={3} placeholder="Accesos, cortes, asfalto, permisos, etc." className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
        <button disabled={loading} className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300">{loading? 'Calculando…' : 'Calcular'}</button>
      </form>
      {out && (
        <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm">
          <div className="font-semibold text-neutral-100">Resultado:</div>
          <pre className="mt-2 whitespace-pre-wrap text-neutral-300">{JSON.stringify(out, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
