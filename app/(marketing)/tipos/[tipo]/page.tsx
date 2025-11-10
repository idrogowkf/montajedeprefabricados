// app/(marketing)/tipos/[tipo]/page.tsx
import React from "react";
import Link from "next/link";

// ===============================================================
// Página dinámica de tipos de obra (static pre-rendering)
// Pre-renderiza las páginas de tipos más comunes:
//   - naves-industriales
//   - puentes
//   - viaductos
//   - fachadas
//   - cubiertas
//   - cerramientos
// ===============================================================

export const dynamicParams = false; // solo genera las rutas listadas abajo

export function generateStaticParams() {
    return [
        { tipo: "naves-industriales" },
        { tipo: "puentes" },
        { tipo: "viaductos" },
        { tipo: "fachadas" },
        { tipo: "cubiertas" },
        { tipo: "cerramientos" },
    ];
}

const TITULOS: Record<string, string> = {
    "naves-industriales": "Montaje de Naves Industriales",
    "puentes": "Montaje de Puentes Prefabricados",
    "viaductos": "Montaje de Viaductos y Estructuras Civiles",
    "fachadas": "Montaje de Fachadas Arquitectónicas",
    "cubiertas": "Montaje de Cubiertas y Placas Pretensadas",
    "cerramientos": "Montaje de Cerramientos Prefabricados",
};

const DESCRIPCIONES: Record<string, string> = {
    "naves-industriales":
        "Montaje integral de estructuras prefabricadas de hormigón o acero para naves logísticas e industriales. Coordinación de transporte, grúas, y equipos de montaje certificados.",
    "puentes":
        "Ejecución de montaje de vigas, dovelas y tableros prefabricados para puentes carreteros y ferroviarios. Control dimensional, seguridad y planificación técnica.",
    "viaductos":
        "Montaje de vigas pretensadas y celosías en grandes luces y accesos complejos. Plan de izado, seguridad, y coordinación de maniobras críticas.",
    "fachadas":
        "Montaje de paneles arquitectónicos de gran formato, anclajes y juntas. Manipulación controlada, izado vertical, y alineación estética en obra.",
    "cubiertas":
        "Montaje de placas alveolares, pretensadas o de celosía en cubiertas industriales y logísticas. Coordinación con estructura metálica y sellado final.",
    "cerramientos":
        "Cerramientos de hormigón prefabricado para parques industriales, centros logísticos y obras de infraestructura. Rapidez, seguridad y control de calidad.",
};

export default function TipoPage({
    params,
}: {
    params: { tipo: string };
}) {
    const { tipo } = params;
    const titulo = TITULOS[tipo] || "Montaje de Prefabricados";
    const descripcion =
        DESCRIPCIONES[tipo] ||
        "Servicio técnico especializado en montaje de estructuras y elementos prefabricados.";

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            {/* Header simple */}
            <header className="sticky top-0 z-40 border-b border-neutral-900/80 bg-neutral-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-400 font-black text-neutral-900">
                            MP
                        </div>
                        <div>
                            <div className="text-sm font-bold tracking-widest text-yellow-400">
                                MONTAJE DE PREFABRICADOS
                            </div>
                            <div className="text-xs text-neutral-400">
                                Estructuras · Transporte · Grúas
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/presupuesto"
                        className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300"
                    >
                        Solicitar cotización
                    </Link>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="mx-auto max-w-5xl px-6 py-16">
                <h1 className="text-4xl font-extrabold text-yellow-400 sm:text-5xl">
                    {titulo}
                </h1>
                <p className="mt-4 text-neutral-300 text-lg">{descripcion}</p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h3 className="font-semibold text-neutral-100">
                            Características del servicio
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-300 list-disc pl-5">
                            <li>Planificación técnica y estudio de izado.</li>
                            <li>Coordinación de transporte especial y grúas.</li>
                            <li>Montaje certificado y control de calidad.</li>
                            <li>Seguridad y documentación PRL.</li>
                            <li>Entrega “as-built” y dossier fotográfico.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                        <h3 className="font-semibold text-neutral-100">
                            Solicita tu presupuesto
                        </h3>
                        <p className="mt-2 text-sm text-neutral-400">
                            Indica el tipo de elementos, tonelajes, radios y fechas
                            estimadas. Te enviaremos una estimación y un plan técnico.
                        </p>
                        <Link
                            href="/presupuesto"
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-neutral-900 ring-2 ring-yellow-300 transition hover:bg-yellow-300"
                        >
                            Generar presupuesto
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900/80 mt-16">
                <div className="mx-auto max-w-7xl px-6 py-10 text-center text-sm text-neutral-400">
                    © {new Date().getFullYear()} Montajedeprefabricados.com · Todos los
                    derechos reservados
                </div>
            </footer>
        </div>
    );
}
