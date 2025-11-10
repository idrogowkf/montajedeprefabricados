// app/(marketing)/tipos/[tipo]/page.tsx
export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

import type { Metadata } from "next";

// Slugs soportados de forma estática (añade o quita según tu site)
const TIPOS: readonly string[] = [
    "naves-industriales",
    "puentes",
    "viaductos",
    "fachadas",
    "cerramientos",
    "otras-tipologias",
];

export function generateStaticParams() {
    return TIPOS.map((tipo) => ({ tipo }));
}

export function generateMetadata({ params }: { params: { tipo: string } }): Metadata {
    const t = params.tipo;
    const titulo = `Montaje de prefabricados — ${t.replace(/-/g, " ")}`;
    return {
        title: titulo,
        description: `Servicios de montaje para ${t.replace(/-/g, " ")}: grúas, transporte especial, cuadrillas y coordinación.`,
    };
}

export default function TipoPage({ params }: { params: { tipo: string } }) {
    const t = params.tipo;
    // (Tu UI/maquetado específico o genérico para el tipo)
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-2xl font-extrabold tracking-tight">Tipo: {t.replace(/-/g, " ")}</h1>
            <p className="mt-2 text-neutral-600">
                Página estática generada para el tipo “{t}”. Sin fallback ni SSR.
            </p>
            {/* TODO: aquí tu contenido real para cada tipo */}
        </main>
    );
}
