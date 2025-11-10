
import React from 'react'
export const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-50/40 px-3 py-1 text-xs font-semibold text-yellow-700">
    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />{children}
  </span>
)
export const Section = ({ id, eyebrow, title, subtitle, children }:{id?:string; eyebrow?:string; title:string; subtitle?:string; children:React.ReactNode})=> (
  <section id={id} className="relative mx-auto max-w-7xl px-6 py-20">
    {eyebrow && (<div className="mb-8 flex items-center gap-3"><Tag>{eyebrow}</Tag><div className="h-px flex-1 bg-gradient-to-r from-yellow-400/60 via-yellow-400/10 to-transparent"/></div>)}
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5"><h2 className="text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">{title}</h2>{subtitle && (<p className="mt-4 text-neutral-300/90">{subtitle}</p>)}</div>
      <div className="lg:col-span-7">{children}</div>
    </div>
  </section>
)
export const Card = ({ children }:{children:React.ReactNode}) => (
  <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10">{children}</div>
)
export const Stat = ({ value, label }:{value:string; label:string}) => (
  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center"><div className="text-3xl font-extrabold text-yellow-400">{value}</div><div className="mt-1 text-sm text-neutral-400">{label}</div></div>
)
