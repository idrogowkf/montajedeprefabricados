
'use client'
import React, { useState } from 'react'
export default function ChatWidget(){
  const [messages, setMessages] = useState<{role:'user'|'assistant'; content:string}[]>([])
  const [input, setInput] = useState('')
  async function send(){
    if(!input.trim()) return
    const next = [...messages, { role:'user' as const, content: input }]
    setMessages(next); setInput('')
    const res = await fetch('/api/assist', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: next }) })
    const j = await res.json(); setMessages([...next, { role:'assistant', content: j.answer || 'Sin respuesta' }])
  }
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-lg font-semibold text-neutral-100">Asistencia técnica / Cotización</h3>
      <div className="mt-3 h-60 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm">
        {messages.length === 0 ? <p className="text-neutral-500">Describe tu montaje (ciudad, elementos, tonelajes, radios, plazos)…</p> : null}
        {messages.map((m,i)=> (
          <div key={i} className={`mb-2 ${m.role==='user'?'text-yellow-300':'text-neutral-300'}`}><strong>{m.role==='user'?'Tú':'Asistente'}:</strong> {m.content}</div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm" placeholder="Escribe tu consulta" />
        <button onClick={send} className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-neutral-900">Enviar</button>
      </div>
    </div>
  )
}
