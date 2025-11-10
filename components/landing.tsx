'use client';

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ===== Versión aprobada DEFINITIVA — COMPLETA (Hotfix v3) =====
// Cambios en esta versión:
//  - Eliminado el bloque DevTests / imagen no disponible.
//  - Añadido teléfono +34 624 433 123 en la sección Contacto.
//  - Mantiene fix de <Tag> cuando children es null/undefined.

// ---------- Helpers ----------
// SafeImage: evita errores cuando la imagen no existe (usa placeholder)
const SafeImage = ({ src, alt, ...props }) => {
    const [safeSrc, setSafeSrc] = useState(src);
    const isLocal = typeof safeSrc === 'string' && safeSrc.startsWith('/');
    const fallbackSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#0a0a0a"/><rect x="6" y="6" width="148" height="88" fill="#111" stroke="#262626"/><text x="80" y="55" fill="#eab308" font-size="10" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">imagen no disponible</text></svg>'
    )}`;

    return (
        <Image
            src={safeSrc}
            alt={alt}
            onError={() => setSafeSrc(fallbackSvg)}
            unoptimized={isLocal}
            {...props}
        />
    );
};

const Tag = ({ children }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500 bg-yellow-400 px-3 py-1 text-xs font-bold text-neutral-900 shadow-md">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
        {children ?? ''}
    </span>
);

const Section = ({ id, eyebrow, title, subtitle, children }) => (
    <section id={id} className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-center gap-3">
            {eyebrow ? <Tag>{eyebrow}</Tag> : null}
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-transparent" />
        </div>
        <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
                <h2 className="text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">{title}</h2>
                {subtitle ? <p className="mt-4 text-neutral-300/90">{subtitle}</p> : null}
            </div>
            <div className="lg:col-span-7">{children}</div>
        </div>
    </section>
);

// ---------- Inline mocks para previsualizar ----------
const LeadForm = () => {
    const [ok, setOk] = useState("");
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setOk("");
        setErr("");
        const form = new FormData(e.currentTarget);
        const payload = {
            nombre: form.get("nombre"),
            empresa: form.get("empresa"),
            email: form.get("email"),
            mensaje: form.get("mensaje"),
            origen: "landing-contacto",
        };
        try {
            const r = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const j = await r.json();
            if (j?.ok) setOk("Solicitud enviada. Te responderemos en 24h.");
            else setErr(j?.error || "No se pudo enviar. Inténtalo de nuevo.");
        } catch (e) {
            setErr("Error de red. Reintenta en unos segundos.");
        }
    };

    return (
        <form onSubmit={submit} className="grid w-full gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
                <input name="nombre" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" placeholder="Nombre" required />
                <input name="empresa" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" placeholder="Empresa" />
            </div>
            <input name="email" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" placeholder="Email / Teléfono" required />
            <textarea name="mensaje" rows={5} className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" placeholder="Elementos, tonelajes, radios, planos, fechas" />
            <button className="w-full rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300">Enviar</button>
            <a
                href="https://wa.me/34624473123?text=Hola%20tengo%20una%20consulta%20sobre%20montaje"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-semibold text-white ring-2 ring-green-400 transition hover:bg-green-600"
            >
                WhatsApp +34 624 473 123
            </a>
            {ok ? <p className="text-sm text-green-400">{ok}</p> : null}
            {err ? <p className="text-sm text-red-400">{err}</p> : null}
        </form>
    );
};

const Calculator = () => {
    const router = useRouter();
    const estimate = (e) => {
        e.preventDefault();
        router.push("/presupuesto");
    };
    return (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold text-neutral-100">Calculadora IA de Montaje</h3>
            <p className="mt-1 text-sm text-neutral-400">Introduce datos clave y obtén una estimación orientativa.</p>
            <form onSubmit={estimate} className="mt-4 grid gap-3">
                <input placeholder="Ciudad" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
                <input placeholder="Elementos (vigas, paneles, losas…)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
                <input placeholder="Tonelajes (ej. 45T, 70T)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
                <input placeholder="Radios de grúa (m)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
                <input placeholder="Plazo objetivo (días/noches)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm" />
                <button className="rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300">Calcular</button>
            </form>
        </div>
    );
};

// ---------- Pictogramas (hover sobrepuestos) ----------
const CraneIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <path d="M6 40h36" stroke="currentColor" strokeWidth="2" />
        <path d="M10 40V18l10-6h18" stroke="currentColor" strokeWidth="2" />
        <path d="M28 12l12 8-6 10" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const TruckIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <rect x="4" y="18" width="22" height="12" stroke="currentColor" strokeWidth="2" />
        <path d="M26 22h10l6 6v2H26z" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="36" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="36" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const BeamIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <rect x="6" y="22" width="36" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M10 18h28M10 34h28" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const TeamIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 34c0-4 4-8 8-8s8 4 8 8v2H8v-2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M24 34c0-4 4-8 8-8s8 4 8 8v2H24v-2Z" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const PlanIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <rect x="8" y="10" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 18h12M16 24h18M16 30h10" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const SafetyIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <path d="M24 6l16 6v10c0 8.284-6.716 16-16 16S8 30.284 8 22V12l16-6Z" stroke="currentColor" strokeWidth="2" />
        <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const Pictogram = ({ name, Icon, items }) => (
    <div className="group relative z-0 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10 hover:z-50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-800 text-yellow-400 ring-1 ring-neutral-700">
            <Icon />
        </div>
        <div className="mt-3 font-semibold text-neutral-100">{name}</div>
        <div className="pointer-events-auto absolute left-1/2 top-full z-50 mt-3 hidden w-72 -translate-x-1/2 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-left shadow-xl ring-1 ring-neutral-800 group-hover:block">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Servicios</div>
            <ul className="mt-2 space-y-2 text-sm text-neutral-300">
                {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        <span>{it}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-3 text-right">
                <a href="#contacto" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-neutral-900 ring-1 ring-yellow-300 hover:bg-yellow-300">Solicitar</a>
            </div>
        </div>
    </div>
);

const PICTOS = [
    { name: 'Grúas y Maniobras', Icon: CraneIcon, items: ['Selección 80–500T+', 'Plan de izados', 'Balizamiento y señalistas', 'Inspección de accesos'] },
    { name: 'Transporte Especial', Icon: TruckIcon, items: ['Rutas y permisos', 'Escoltas', 'Coordinación carga/descarga', 'Tracking en ruta'] },
    { name: 'Montaje de Elementos', Icon: BeamIcon, items: ['Vigas y losas alveolares', 'Pilares y pórticos', 'Paneles de fachada', 'Ajustes y sellados'] },
    { name: 'Cuadrillas', Icon: TeamIcon, items: ['Capataces', 'Soldadores / pernos', 'Atornillado controlado', 'Turnos día/noche'] },
    { name: 'Planos y As-Built', Icon: PlanIcon, items: ['Planos 2D/3D', 'Marcado de piezas', 'Dossier fotográfico', 'As-built final'] },
    { name: 'Seguridad y Calidad', Icon: SafetyIcon, items: ['PSS / PTB', 'Checklists útiles/grúas', 'Partes diarios', 'Cierre documental'] },
];

const PictogramGrid = () => (
    <div className="relative isolate grid gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-visible">
        {PICTOS.map((p) => (
            <Pictogram key={p.name} {...p} />
        ))}
    </div>
);

// ---------- PROYECTOS (6 experiencias reales) ----------
const PROYECTOS = [
    // Vivienda (2)
    {
        src: "/proyectos/vivienda-unifamiliar-losas-12t.webp",
        titulo: "Vivienda unifamiliar — Losas alveolares 12t",
        meta: "Grúa 200T · Radio 16 m · 2 jornadas diurnas · 18 piezas",
        alt: "Montaje de losas alveolares de 12 toneladas en vivienda unifamiliar",
    },
    {
        src: "/proyectos/residencial-altura-panel-9t.webp",
        titulo: "Residencial en altura — Panel fachada 9t",
        meta: "16 paneles · Grúa 250T · Radio 18 m · 2 jornadas diurnas",
        alt: "Montaje de paneles de 9 toneladas en edificio residencial en altura",
    },
    // Obra civil (2)
    {
        src: "/proyectos/civil-viaducto-viga-wt-80t.webp",
        titulo: "Obra civil — Viaducto con viga WT 80t",
        meta: "Grúa 350T · Radio 22 m · 3 noches",
        alt: "Izado y montaje de viga WT de 80 toneladas en viaducto",
    },
    {
        src: "/proyectos/civil-puente-viga-cajon-150t.webp",
        titulo: "Obra civil — Puente con viga cajón 150t",
        meta: "Grúa 500T · Radio 24 m · 4 jornadas diurnas",
        alt: "Montaje de viga cajón de 150 toneladas en puente",
    },
    // Industrial (2)
    {
        src: "/proyectos/industrial-panel-fachada-22t.webp",
        titulo: "Industrial — Paneles de fachada 22t",
        meta: "16 paneles · Grúa 300T · Radio 18 m · 2 jornadas",
        alt: "Montaje industrial de paneles de fachada de 22 toneladas",
    },
    {
        src: "/proyectos/industrial-nave-losa-alveolar-35t.webp",
        titulo: "Industrial — Nave logística con losas 35t",
        meta: "42 piezas · Grúa 250T · Radio 20 m · 3 jornadas",
        alt: "Montaje de losas alveolares de 35 toneladas en nave logística",
    },
];

// ---------- Página completa ----------
export default function Landing() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-neutral-900/80 bg-neutral-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <a href="#" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-400 font-black text-neutral-900">MP</div>
                        <div>
                            <div className="text-sm font-bold tracking-widest text-yellow-400">MONTAJE DE PREFABRICADOS</div>
                            <div className="text-xs text-neutral-400">Estructuras · Transporte · Grúas</div>
                        </div>
                    </a>
                    <nav className="hidden items-center gap-6 md:flex">
                        <a href="#servicios" className="text-sm text-neutral-300 hover:text-yellow-300">Servicios</a>
                        <a href="#proceso" className="text-sm text-neutral-300 hover:text-yellow-300">Proceso</a>
                        <a href="#proyectos" className="text-sm text-neutral-300 hover:text-yellow-300">Proyectos</a>
                        <a href="#confianza" className="text-sm text-neutral-300 hover:text-yellow-300">Confianza</a>
                        <a href="#contacto" className="text-sm text-neutral-300 hover:text-yellow-300">Contacto</a>
                        <a href="/presupuesto" className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300">Solicitar cotización</a>
                    </nav>
                </div>
            </header>

            {/* Héroe — tarjeta derecha = CALCULADORA */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(250,204,21,0.15),rgba(0,0,0,0))]" />
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <Tag>Especialistas en Montaje Industrial</Tag>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-neutral-100 sm:text-6xl">Montaje de prefabricados, sin sorpresas.</h1>
                        <p className="mt-4 max-w-2xl text-lg text-neutral-300">
                            Ingeniería de izado, equipos certificados y cuadrillas expertas para viaductos, naves, puentes, fachadas y gran formato.
                            Coordinamos transporte, grúas y maniobras críticas, desde el planteizado hasta la entrega.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded-full bg-neutral-800/70 px-3 py-1 text-xs text-neutral-200 ring-1 ring-neutral-700">COORDINACIÓN CON IBERCARGA</span>
                            <span className="inline-flex items-center rounded-full bg-neutral-800/70 px-3 py-1 text-xs text-neutral-200 ring-1 ring-neutral-700">PLANOS DE MONTAJE</span>
                            <span className="inline-flex items-center rounded-full bg-neutral-800/70 px-3 py-1 text-xs text-neutral-200 ring-1 ring-neutral-700">ASESORÍA DE MANIOBRAS</span>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a href="/presupuesto" className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300">Calcula tu montaje</a>
                            <a href="#servicios" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold text-neutral-200 ring-1 ring-neutral-800 transition hover:bg-neutral-900">Ver servicios</a>
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
                            <div className="absolute -left-10 -top-10 hidden h-32 w-32 rotate-6 rounded-2xl bg-yellow-400/10 blur-2xl md:block" />
                            <Calculator />
                        </div>
                    </div>
                </div>
            </section>

            {/* Marcador de ancla para CTA "Calcula tu montaje" */}
            <div id="calcula" className="mx-auto max-w-7xl px-6 pb-4" />

            {/* Catálogo pictos */}
            <Section
                id="servicios"
                eyebrow="Catálogo de servicios"
                title="Todo el ciclo del montaje prefabricado"
                subtitle="Un solo interlocutor para logística, ingeniería de izado, grúas, mano de obra, planteizado y planos de montaje. Coordinación directa con Ibercarga para transportes especiales."
            >
                <PictogramGrid />
            </Section>

            {/* Proceso */}
            <Section
                id="proceso"
                eyebrow="Cómo trabajamos"
                title="Proceso claro, obra predecible"
                subtitle="Metodología orientada a plazo, seguridad y cero sorpresas: planificación, permisos, izados, montaje y entrega."
            >
                <ol className="grid gap-6 md:grid-cols-2">
                    {[
                        ["1. Ingeniería y planificación", "Revisión de planos, secuencia de montaje, plan de izados y HAZID."],
                        ["2. Logística y permisos", "Coordinación de transporte con Ibercarga, accesos, plataformas y cortes."],
                        ["3. Preparativos en obra", "Planteizado, señalización, acopios y coordinación de cuadrillas."],
                        ["4. Montaje y control", "Ejecución por fases, control dimensional, trazabilidad y partes diarios."],
                        ["5. QA/QC y seguridad", "Inspecciones, checklists, liberaciones y cierre sin incidencias."],
                        ["6. Entrega y as-built", "Entrega de dossier fotográfico, planos finales y lecciones aprendidas."],
                    ].map(([title, desc], i) => (
                        <li key={i} className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                            <div className="flex items-start gap-4">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-800 text-yellow-400 ring-1 ring-neutral-700">{i + 1}</div>
                                <div>
                                    <h4 className="font-semibold text-neutral-100">{title}</h4>
                                    <p className="mt-1 text-neutral-300">{desc}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* Proyectos (6 experiencias reales) */}
            <Section
                id="proyectos"
                eyebrow="Obras destacadas"
                title="Experiencia en puentes, naves y fachada arquitectónica"
                subtitle="Galería representativa con tonelajes, radios, equipos y plazos."
            >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PROYECTOS.map((p, i) => (
                        <div key={i} className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                            <div className="relative aspect-[16/10]">
                                <SafeImage
                                    src={p.src}
                                    alt={p.alt}
                                    fill
                                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                                    className="object-cover"
                                    priority={i < 2}
                                />
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold text-neutral-100">{p.titulo}</div>
                                <div className="mt-1 text-xs text-neutral-400">{p.meta}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Confianza (sin mención a referencias) */}
            <Section
                id="confianza"
                eyebrow="Confianza y cumplimiento"
                title="Indicadores verificables"
                subtitle="Sin promesas vacías: mostramos métricas operativas y documentación comprobable."
            >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        ["0", "Incidentes LTI en 24 meses"],
                        ["3M€", "Cobertura de RC / accidentes (póliza vigente)"],
                        ["500T+", "Selección de grúas y útiles certificados"],
                        ["QA/QC", "Checklists, trazabilidad y dossier de cierre"],
                        ["PRL", "Plan de Seguridad, permisos y señalización"],
                        ["24h", "SLA de respuesta comercial"],
                    ].map(([v, l], i) => (
                        <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center">
                            <div className="text-3xl font-extrabold text-yellow-400">{v}</div>
                            <div className="mt-1 text-sm text-neutral-400">{l}</div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Contacto (LeadForm con botones apilados) */}
            <Section
                id="contacto"
                eyebrow="Contacto"
                title="Reserva tu ventana de izado"
                subtitle="Cuéntanos fechas objetivo, tonelajes y radios. Te proponemos configuración de grúas, plan de izados y cronograma."
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <LeadForm />
                    </div>
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <ul className="mt-2 space-y-3 text-neutral-300">
                            <li><strong>Email:</strong> ofertas@montajedeprefabricados.com</li>
                            <li><strong>Atención:</strong> Lun–Vie 08:00–19:00</li>
                            <li><strong>Teléfono:</strong> +34 624 433 123</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Footer */}
            <footer className="border-t border-neutral-900/80">
                <div className="mx-auto max-w-7xl px-6 py-10 text-center text-sm text-neutral-400">
                    © {new Date().getFullYear()} Montajedeprefabricados.com · Todos los derechos reservados
                </div>
            </footer>
        </div>
    );
}
