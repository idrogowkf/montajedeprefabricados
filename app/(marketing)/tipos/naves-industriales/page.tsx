// app/(marketing)/tipos/naves-industriales/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de prefabricados — Naves industriales",
    description:
        "Montaje de naves industriales prefabricadas: vigas, losas alveolares, pilares y fachadas con gruas de 80–500T, cuadrillas especializadas y coordinacion de transporte.",
};

export default function NavesIndustrialesPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Montaje de naves industriales prefabricadas
            </h1>

            <p className="mt-3 text-neutral-700">
                Montaje integral de estructuras prefabricadas para naves logisticas y
                plataformas industriales: coordinacion de gruas, transporte especial y
                cuadrillas de montaje.
            </p>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Alcance tipico
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Montaje de losas alveolares y vigas prefabricadas.</li>
                        <li>Pilares, mensulas y porticos completos.</li>
                        <li>Fachadas de panel prefabricado (ciego y sandwich).</li>
                        <li>Coordinacion de medios auxiliares y plataformas elevadoras.</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Como trabajamos
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Estudio previo de izados, radios y accesos.</li>
                        <li>Jornadas diurnas/nocturnas segun ventana de obra.</li>
                        <li>Integracion con tu planificacion y resto de subcontratas.</li>
                        <li>Partes diarios, control dimensional y cierre QA/QC.</li>
                    </ul>
                    <p className="mt-4 text-sm text-neutral-700">
                        Si ya conoces tonelajes y radios, puedes{" "}
                        <a href="/presupuesto" className="font-semibold text-yellow-600">
                            generar un presupuesto tecnico orientativo
                        </a>{" "}
                        desde la calculadora.
                    </p>
                </div>
            </section>
        </main>
    );
}
