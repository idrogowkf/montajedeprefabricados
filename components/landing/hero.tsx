import Link from "next/link";
import Calculator from "@/components/calculator";
import { Tag } from "@/components/landing/section";

export function Hero() {
  return <section className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(250,204,21,0.15),rgba(0,0,0,0))]" />
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Tag>Planificación técnica y ejecución</Tag>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-neutral-100 sm:text-6xl">Montaje de prefabricados en España</h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-300">Estudio y coordinación del montaje de prefabricados de hormigón, estructuras metálicas, paneles, fachadas, naves, puentes y viaductos. La preparación integra piezas, accesos, transporte, equipos de elevación y secuencia de obra.</p>
        <ul className="mt-6 flex flex-wrap gap-3" aria-label="Áreas de trabajo">
          {['INGENIERÍA DE MONTAJE','PLANIFICACIÓN DE IZADOS','LOGÍSTICA Y EJECUCIÓN'].map(label => <li key={label} className="rounded-full bg-neutral-800/70 px-3 py-1 text-xs ring-1 ring-neutral-700">{label}</li>)}
        </ul>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/presupuesto" className="rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-neutral-900">Preparar presupuesto</Link>
          <Link href="/ingenieria" className="rounded-2xl px-5 py-3 font-semibold ring-1 ring-neutral-800">Ver ingeniería de montaje</Link>
        </div>
      </div>
      <div className="lg:col-span-5"><Calculator /></div>
    </div>
  </section>;
}
