// app/(marketing)/tipos/cerramientos/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de prefabricados — Cerramientos",
    description:
        "Montaje de cerramientos prefabricados para naves, centros logisticos y edificios terciarios: paneles, muros y petos prefabricados.",
};

export default function CerramientosPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Montaje de cerramientos prefabricados
            </h1>

            <p className="mt-3 text-neutral-700">
                Cerramientos perimetrales de naves y edificios mediante panel
                prefabricado, muros y soluciones combinadas con malla, chapa o vidrio.
            </p>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Soluciones habituales
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Cerramientos de panel de hormigon.</li>
                        <li>Muros prefabricados de contencion y medianeras.</li>
                        <li>Petos y remates de cubierta.</li>
                        <li>
                            Integracion con cierres ligeros (panel sandwich, chapa,
                            malla, etc.).
                        </li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Ventajas del prefabricado
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Rapidez de ejecucion y menor impacto en obra.</li>
                        <li>Acabados homogeneos y controlados en fabrica.</li>
                        <li>Menos dependencias de clima para cierre de envolvente.</li>
                        <li>Facilidad para fases de ampliacion o modificaciones.</li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
