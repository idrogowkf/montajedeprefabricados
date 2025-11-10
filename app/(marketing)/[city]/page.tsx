
import { cities } from '@/lib/cities'
import { cityCopy } from '@/lib/copy'
import { Section } from '@/components/ui'
export function generateStaticParams(){ return cities.map(city=>({ city })) }
export const dynamicParams = false
export default function CityPage({ params }:{ params:{ city:string } }){
  const { city } = params; const c = cityCopy(city)
  return (
    <main>
      <Section title={c.title} subtitle={c.desc}>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-300">Servicios: montaje de vigas y losas alveolares, pilares y pórticos; grúas 80–500T+; coordinación con Ibercarga; replanteo y as‑built.</p>
          <ul className="mt-4 list-inside list-disc text-neutral-300">
            <li>KPIs locales y disponibilidad de equipos en {city}</li>
            <li>SLAs de respuesta &lt;24h</li>
            <li>Planes de izado y seguridad incluidos</li>
          </ul>
        </div>
      </Section>
    </main>
  )
}
