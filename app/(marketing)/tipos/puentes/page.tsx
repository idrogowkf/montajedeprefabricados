// app/(marketing)/tipos/puentes/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de prefabricados — Puentes",
    description:
        "Montaje de puentes prefabricados: vigas cajon, vigas artesa, dinteles y prelosas. Plan de izado, cortes de trafico y cuadrillas especializadas en obra civil.",
};

export default function PuentesPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Montaje de puentes prefabricados
            </h1>

            <p className="mt-3 text-neutral-700">
                Especialistas en montaje de vigas de gran tonelaje para pasos
                superiores, inferiores y estructuras singulares en carreteras y ferrocarril.
            </p>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Tipologia de elementos
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Vigas cajon, artesa, doble T y WT de hasta 150 t.</li>
                        <li>Prelosas, losas macizas y diafragmas prefabricados.</li>
                        <li>Pilas, estribos, dinteles y elementos singulares.</li>
                        <li>Coordinacion con topografia y replanteo.</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Ingenieria de izado
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Plan de izado (Lifting Plan) con radios y configuraciones.</li>
                        <li>Estudio de ventanas de corte de trafico y desvios.</li>
                        <li>
                            Seleccion de gruas 300–500T y utiles certificados (spreader,
                            balancines, eslingas).
                        </li>
                        <li>Protocolos de seguridad y coordinacion con DGC / ADIF.</li>
                    </ul>
                    <p className="mt-4 text-sm text-neutral-700">
                        Cuentanos tu tipologia de puente y te ayudamos a dimensionar gruas
                        y secuencia de montaje.
                    </p>
                </div>
            </section>
        </main>
    );
}
