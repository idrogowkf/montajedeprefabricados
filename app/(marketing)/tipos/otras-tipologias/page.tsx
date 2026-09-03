// app/(marketing)/tipos/otras-tipologias/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de prefabricados — Otras tipologías",
    description:
        "Montaje de estructuras prefabricadas especiales: edificios singulares, marquesinas, estructuras mixtas y soluciones a medida.",
};

// Fuerza que esta ruta se trate como estática
export const dynamic = "force-static";

export default function OtrasTipologiasPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Otras tipologías de montaje prefabricado
            </h1>

            <p className="mt-3 text-neutral-700">
                Damos soporte a soluciones que se salen del estándar: edificios
                singulares, ampliaciones complejas, estructuras mixtas y montajes en
                entornos especialmente restringidos.
            </p>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Ejemplos de alcance
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Marquesinas y cubiertas especiales.</li>
                        <li>Centros logísticos con soluciones mixtas acero–hormigón.</li>
                        <li>Ampliaciones en naves en explotación.</li>
                        <li>Intervenciones en entornos urbanos complejos.</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Próximo paso
                    </h2>
                    <p className="mt-3 text-sm text-neutral-700">
                        Si tu proyecto no encaja al cien por cien en las categorías
                        anteriores, explícanos los elementos, tonelajes y condicionantes.
                    </p>
                    <p className="mt-3 text-sm text-neutral-700">
                        Puedes usar la{" "}
                        <a href="/presupuesto" className="font-semibold text-yellow-600">
                            calculadora de presupuesto técnico
                        </a>{" "}
                        o escribirnos directamente desde la sección de contacto.
                    </p>
                </div>
            </section>
        </main>
    );
}
