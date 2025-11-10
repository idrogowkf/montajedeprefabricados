
import { tipos } from '@/lib/cities'
import { tipoCopy } from '@/lib/copy'
import { Section } from '@/components/ui'
export function generateStaticParams(){ return tipos.map(tipo=>({ tipo })) }
export const dynamicParams = false
export default function TipoPage({ params }:{ params:{ tipo:string } }){
  const { tipo } = params; const t = tipoCopy(tipo)
  return (
    <main>
      <Section title={t.title} subtitle={t.desc}>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-neutral-300">Cobertura nacional, cuadrillas especializadas y coordinación de transporte especial. Entrega con dossier QA/QC y as‑built.</p>
        </div>
      </Section>
    </main>
  )
}
