import Link from "next/link";
import { Section } from "@/components/landing/section";
const principles = [
  ['Trazabilidad de datos', 'Las decisiones deben partir de revisiones identificables de planos, despieces y fichas de elementos.'],
  ['Límites explícitos', 'Las hipótesis y los datos pendientes se señalan para que puedan verificarse antes de la maniobra.'],
  ['Estados provisionales', 'Cada paso considera cómo queda estable la pieza antes de liberar el equipo de elevación.'],
  ['Coordinación operativa', 'Secuencia, transporte, señalización y comunicaciones se tratan como partes del mismo montaje.'],
] as const;
export function TrustSection() { return <Section id="criterios" eyebrow="Criterio técnico" title="Información útil para tomar decisiones de montaje" subtitle="La confianza se construye explicando qué datos hacen falta, qué se comprueba y qué queda fuera de una primera estimación."><div className="grid gap-6 sm:grid-cols-2">{principles.map(([title,text])=><article key={title} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"><h3 className="font-semibold text-neutral-100">{title}</h3><p className="mt-2 text-sm text-neutral-300">{text}</p></article>)}</div><div className="mt-8 flex flex-wrap gap-4"><Link href="/ingenieria" className="font-semibold text-yellow-400">Profundizar en ingeniería →</Link><Link href="/guias" className="font-semibold text-yellow-400">Consultar guías →</Link></div></Section> }
