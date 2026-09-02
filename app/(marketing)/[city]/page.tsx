
import { cities } from '@/lib/cities'
import { cityCopy } from '@/lib/copy'
import { Section } from '@/components/ui'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { buildMetadata, jsonLdBreadcrumbs } from '@/lib/seo'
export function generateStaticParams(){ return cities.map(city=>({ city })) }
export const dynamicParams = false
export function generateMetadata({params}:{params:{city:string}}):Metadata{const copy=cityCopy(params.city);return buildMetadata({title:copy.title,description:copy.desc,path:`/${params.city}`})}
export default function CityPage({ params }:{ params:{ city:string } }){
  const { city } = params; const c = cityCopy(city)
  return (
    <main>
      <JsonLd data={jsonLdBreadcrumbs([{name:'Inicio',path:'/'},{name:'Ciudades',path:'/ciudades'},{name:c.title,path:`/${city}`}])} />
      <nav aria-label="Migas de pan" className="mx-auto max-w-7xl px-6 pt-8 text-sm"><a href="/">Inicio</a> <span aria-hidden="true">/</span> <a href="/ciudades">Ciudades</a> <span aria-hidden="true">/</span> <span>{c.title}</span></nav>
      <Section title={c.title} subtitle={c.desc}>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-300">Servicios: montaje de vigas y losas alveolares, pilares y pórticos; grúas 80–500T+; coordinación con Ibercarga; replanteo y as‑built.</p>
          <ul className="mt-4 list-inside list-disc text-neutral-300">
            <li>KPIs locales y disponibilidad de equipos en {city}</li>
            <li>SLAs de respuesta &lt;24h</li>
            <li>Planes de izado y seguridad incluidos</li>
          </ul>
          <p className="mt-6"><a className="font-semibold text-yellow-400" href="/ciudades">Ver cobertura y criterios por ubicación</a></p>
        </div>
      </Section>
    </main>
  )
}
