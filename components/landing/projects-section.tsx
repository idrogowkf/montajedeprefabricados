import Link from "next/link";
import { SafeImage } from "@/components/landing/safe-image";
import { Section } from "@/components/landing/section";

const types = [
  ['/proyectos/civil-puente-viga-cajon-150t.webp', 'Puentes', 'Vigas, tableros, apoyos y secuencias condicionadas por accesos e interferencias.', '/tipos/puentes'],
  ['/proyectos/civil-viaducto-viga-wt-80t.webp', 'Viaductos', 'Montajes repetitivos que requieren coordinar suministro, radios y estabilidad de cada vano.', '/tipos/viaductos'],
  ['/proyectos/industrial-nave-losa-alveolar-35t.webp', 'Naves industriales', 'Pilares, cerchas, vigas, correas y cerramientos integrados en una secuencia común.', '/tipos/naves-industriales'],
  ['/proyectos/industrial-panel-fachada-22t.webp', 'Fachadas y paneles', 'Manipulación, posicionamiento, tolerancias y fijación temporal de elementos verticales.', '/tipos/fachadas'],
] as const;

export function ProjectsSection() { return <Section id="tipologias" eyebrow="Tipologías" title="El método cambia con cada sistema prefabricado" subtitle="No se presentan estas imágenes como proyectos propios: son referencias visuales para explicar los condicionantes habituales de cada tipología."><div className="grid gap-6 sm:grid-cols-2">{types.map(([src,title,text,href])=><article key={href} className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"><div className="relative aspect-[16/8]"><SafeImage src={src} alt={`Imagen ilustrativa de ${title.toLowerCase()}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover"/></div><div className="p-5"><h3 className="font-semibold text-neutral-100">{title}</h3><p className="mt-2 text-sm text-neutral-300">{text}</p><Link href={href} className="mt-4 inline-flex text-sm font-semibold text-yellow-400">Ver montaje de {title.toLowerCase()} →</Link></div></article>)}</div></Section> }
