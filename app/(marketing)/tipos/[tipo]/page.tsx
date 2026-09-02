// app/(marketing)/tipos/[tipo]/page.tsx
export const dynamic = "error";        // prohíbe dinámico/SSR
export const dynamicParams = false;    // NO hay slugs fuera de los listados
export const revalidate = false;       // totalmente estático

import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, jsonLdBreadcrumbs } from "@/lib/seo";

// LISTA CERRADA de slugs
const TIPOS = [
    "naves-industriales",
    "puentes",
    "viaductos",
    "fachadas",
    "cerramientos",
    "otras-tipologias",
] as const;

export function generateStaticParams() {
    return TIPOS.map((tipo) => ({ tipo }));
}

export function generateMetadata(
    { params }: { params: { tipo: string } }
): Metadata {
    const t = params.tipo.replace(/-/g, " ");
    return buildMetadata({title:`Montaje de prefabricados — ${t}`,description:`Servicios de montaje para ${t}: grúas, transporte especial, cuadrillas y coordinación.`,path:`/tipos/${params.tipo}`});
}

export default function TipoPage({ params }: { params: { tipo: (typeof TIPOS)[number] } }) {
    const t = params.tipo.replace(/-/g, " ");
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <JsonLd data={jsonLdBreadcrumbs([{name:"Inicio",path:"/"},{name:"Tipologías",path:"/tipologias"},{name:t,path:`/tipos/${params.tipo}`}])} />
            <nav aria-label="Migas de pan" className="mb-6 text-sm"><a href="/">Inicio</a> <span aria-hidden="true">/</span> <a href="/tipologias">Tipologías</a> <span aria-hidden="true">/</span> <span>{t}</span></nav>
            <h1 className="text-2xl font-extrabold tracking-tight">Tipo: {t}</h1>
            <p className="mt-2 text-neutral-600">
                Página estática generada sin fallback ni SSR. Slugs permitidos: {TIPOS.join(", ")}.
            </p>
            <p className="mt-6"><a className="font-semibold text-yellow-400" href="/tipologias">Comparar tipologías de montaje</a></p>
            {/* TODO: Maquetado real para cada tipo */}
        </main>
    );
}
