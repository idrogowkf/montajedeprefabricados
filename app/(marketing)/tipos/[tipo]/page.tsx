// app/(marketing)/tipos/[tipo]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

// Fuerza SSG: nada de runtime dynamic ni cookies/headers
export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

type Params = { params: { tipo: string } };

// ---- Contenido por tipo ----
const TIPOS: Record<
    string,
    {
        title: string;
        subtitle: string;
        bullets: string[];
        images: { src: string; alt: string; meta?: string }[];
        cta?: { href: string; label: string };
    }
> = {
    "naves-industriales": {
        title: "Naves industriales",
        subtitle:
            "Montaje integral de prefabricado: pilares, pórticos, losas alveolares y panel de fachada. Plan de izado, cuadrillas y grúas coordinadas.",
        bullets: [
            "Plan de izados para grandes formatos",
            "Coordinación de transporte especial (Ibercarga)",
            "Montaje de losas alveolares y paneles sándwich",
            "Turnos día/noche, balizamiento y señalistas",
        ],
        images: [
            {
                src: "/proyectos/industrial-nave-losa-alveolar-35t.webp",
                alt: "Nave logística con losas alveolares 35t",
                meta: "Grúa 250T · Radio 20 m · 3 jornadas",
            },
            {
                src: "/proyectos/industrial-panel-fachada-22t.webp",
                alt: "Panel industrial de 22t",
                meta: "16 paneles · 2 jornadas",
            },
        ],
        cta: { href: "/presupuesto", label: "Calcular montaje" },
    },
    puentes: {
        title: "Puentes",
        subtitle:
            "Montaje de vigas cajón, V/O, WT y elementos singulares. Análisis de curvas Liebherr y maniobras críticas.",
        bullets: [
            "Izados nocturnos con cortes coordinados",
            "Selección de grúas 300–500T+",
            "QA/QC y control dimensional",
            "Dossier de cierre y as-built",
        ],
        images: [
            {
                src: "/proyectos/civil-puente-viga-cajon-150t.webp",
                alt: "Puente con viga cajón 150t",
                meta: "Grúa 500T · 4 jornadas",
            },
            {
                src: "/proyectos/civil-viaducto-viga-wt-80t.webp",
                alt: "Viaducto con viga WT 80t",
                meta: "Grúa 350T · Radio 22 m",
            },
        ],
        cta: { href: "/presupuesto", label: "Solicitar propuesta" },
    },
    viaductos: {
        title: "Viaductos",
        subtitle:
            "Ejecución por fases con pórticos y vigas WT de gran tonelaje. Señalización, accesos y plataformas.",
        bullets: [
            "Planificación de acopios y fases",
            "Señalización y permisos",
            "Control de radios y contrapesos",
            "Checklists de seguridad y útiles",
        ],
        images: [
            {
                src: "/proyectos/civil-viaducto-viga-wt-80t.webp",
                alt: "Viga WT en viaducto",
                meta: "80 t · radio 22 m",
            },
            {
                src: "/proyectos/civil-puente-viga-cajon-150t.webp",
                alt: "Viga cajón gran formato",
                meta: "Grúa 500T",
            },
        ],
        cta: { href: "/presupuesto", label: "Planificar izados" },
    },
    fachadas: {
        title: "Fachadas arquitectónicas",
        subtitle:
            "Montaje de paneles vistos y texturizados. Tolerancias, anclajes y secuencia sin sorpresas.",
        bullets: [
            "Marcado y replanteo preciso",
            "Útiles, eslingas y herrajes certificados",
            "Ajustes, sellados y remates",
            "Dossier fotográfico y as-built",
        ],
        images: [
            {
                src: "/proyectos/residencial-altura-panel-9t.webp",
                alt: "Panel fachada 9t en residencial",
                meta: "Radio 18 m · 2 jornadas",
            },
            {
                src: "/proyectos/industrial-panel-fachada-22t.webp",
                alt: "Fachada industrial 22t",
                meta: "16 paneles · logística coordinada",
            },
        ],
        cta: { href: "/presupuesto", label: "Solicitar planificación" },
    },
    cubiertas: {
        title: "Cubiertas",
        subtitle:
            "Montaje de cubiertas prefabricadas, correas y remates. Seguridad y accesos priorizados.",
        bullets: [
            "Líneas de vida y barandillas temporales",
            "Plataformas elevadoras coordinadas",
            "Secuencias por paños",
            "Cierre estanco y control de calidad",
        ],
        images: [
            {
                src: "/proyectos/industrial-nave-losa-alveolar-35t.webp",
                alt: "Cubiertas con losas alveolares",
                meta: "42 piezas · 3 jornadas",
            },
            {
                src: "/proyectos/vivienda-unifamiliar-losas-12t.webp",
                alt: "Cubierta vivienda con losas 12t",
                meta: "200T · radio 16 m",
            },
        ],
        cta: { href: "/presupuesto", label: "Solicitar propuesta" },
    },
    cerramientos: {
        title: "Cerramientos",
        subtitle:
            "Cerramientos perimetrales y panelería prefabricada. Tiempos competitivos y acabados limpios.",
        bullets: [
            "Paneles de cerramiento y sándwich",
            "Sellados y encuentros",
            "Integración con carpinterías",
            "Inspecciones y checklist final",
        ],
        images: [
            {
                src: "/proyectos/industrial-panel-fachada-22t.webp",
                alt: "Cerramiento de paneles 22t",
                meta: "Grúa 300T · 2 jornadas",
            },
            {
                src: "/proyectos/residencial-altura-panel-9t.webp",
                alt: "Cerramiento residencial",
                meta: "9t · alta precisión",
            },
        ],
        cta: { href: "/presupuesto", label: "Calcular montaje" },
    },
};

// --- paths estáticos ---
export function generateStaticParams() {
    return [
        { tipo: "naves-industriales" },
        { tipo: "puentes" },
        { tipo: "viaductos" },
        { tipo: "fachadas" },
        { tipo: "cubiertas" },
        { tipo: "cerramientos" }, // <- este faltaba o quedaba dinámico
    ];
}

export function generateMetadata({ params }: Params) {
    const key = params.tipo;
    const d = TIPOS[key];
    if (!d) return {};
    return {
        title: `${d.title} | Montaje de Prefabricados`,
        description: d.subtitle,
    };
}

export default function TipoPage({ params }: Params) {
    const key = params.tipo;
    const d = TIPOS[key];
    if (!d) return notFound();

    return (
        <main className="mx-auto max-w-6xl px-5 py-10">
            <header className="mb-6">
                <a href="/" className="text-sm text-neutral-500 hover:underline">
                    ← Volver
                </a>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
                    {d.title}
                </h1>
                <p className="mt-2 text-sm text-neutral-600">{d.subtitle}</p>
            </header>

            <section className="grid gap-6 md:grid-cols-2">
                <ul className="space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    {d.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-800">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
                <div className="grid gap-4">
                    {d.images.map((im, i) => (
                        <figure
                            key={i}
                            className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                        >
                            <div className="relative aspect-[16/10]">
                                <Image
                                    src={im.src}
                                    alt={im.alt}
                                    fill
                                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                            {im.meta ? (
                                <figcaption className="px-3 py-2 text-center text-xs text-neutral-600">
                                    {im.meta}
                                </figcaption>
                            ) : null}
                        </figure>
                    ))}
                </div>
            </section>

            {d.cta ? (
                <div className="mt-8">
                    <a
                        href={d.cta.href}
                        className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 hover:bg-yellow-300"
                    >
                        {d.cta.label}
                    </a>
                </div>
            ) : null}
        </main>
    );
}
