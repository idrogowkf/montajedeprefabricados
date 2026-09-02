import { Section } from "@/components/landing/section";
const steps = [
  ['Datos de partida', 'Planos vigentes, despiece, pesos, dimensiones, apoyos, accesos y restricciones.'],
  ['Medios y posiciones', 'Carga suspendida, radio real, configuración del equipo, terreno e interferencias.'],
  ['Secuencia y logística', 'Orden de transporte, descarga, acopio, izado y estados de estabilidad provisional.'],
  ['Preparación en obra', 'Replanteo, plataformas, zonas de exclusión, comunicaciones y criterios de parada.'],
  ['Montaje y control', 'Posicionamiento, fijación temporal, comprobaciones y gestión de desviaciones.'],
  ['Cierre', 'Revisión del alcance ejecutado, incidencias y documentación acordada para la entrega.'],
] as const;
export function ProcessSection() { return <Section id="proceso" eyebrow="Método" title="Una secuencia definida antes del primer izado" subtitle="La planificación reduce incertidumbres al convertir los datos de proyecto en decisiones comprobables para cada fase."><ol className="grid gap-6 md:grid-cols-2">{steps.map(([title,text],i)=><li key={title} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"><h3 className="font-semibold"><span className="text-yellow-400">{i+1}.</span> {title}</h3><p className="mt-2 text-neutral-300">{text}</p></li>)}</ol></Section> }
