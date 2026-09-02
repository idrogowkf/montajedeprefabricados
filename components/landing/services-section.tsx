import Link from "next/link";
import { Section } from "@/components/landing/section";

const services = [
  ['Ingeniería de montaje', ['Revisión de datos de partida', 'Secuencia y posiciones de trabajo', 'Condicionantes y puntos de control']],
  ['Grúas y maniobras', ['Carga total suspendida', 'Radio y configuración', 'Interferencias y zonas de exclusión']],
  ['Transporte especial', ['Orden de suministro', 'Accesos y radios de giro', 'Descarga y zonas de acopio']],
  ['Montaje de elementos', ['Vigas, pilares y losas', 'Paneles y fachadas', 'Estructuras metálicas']],
  ['Control de ejecución', ['Replanteo y tolerancias', 'Estabilidad provisional', 'Registro de incidencias']],
  ['Documentación', ['Planos vigentes y despiece', 'Secuencia comunicada', 'Cierre según alcance acordado']],
] as const;

export function ServicesSection() {
  return <Section id="servicios" eyebrow="Servicios" title="Del estudio previo al cierre del montaje" subtitle="El alcance se define para cada obra a partir de los elementos, el emplazamiento, los medios necesarios y las responsabilidades de los intervinientes.">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map(([name, items]) => <article key={name} className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-neutral-800 text-xl font-bold text-yellow-400" aria-hidden="true">{name[0]}</div>
      <h3 className="mt-3 font-semibold text-neutral-100">{name}</h3>
      <ul className="mt-4 flex-1 space-y-1 text-left text-sm text-neutral-300">{items.map(item => <li key={item}>• {item}</li>)}</ul>
      <a href="#contacto" className="mt-5 rounded-xl border border-yellow-400 px-3 py-2 text-sm font-semibold text-yellow-400">Consultar alcance</a>
    </article>)}</div>
    <Link href="/servicios" className="mt-8 inline-flex font-semibold text-yellow-400">Ver el alcance completo de servicios →</Link>
  </Section>;
}
