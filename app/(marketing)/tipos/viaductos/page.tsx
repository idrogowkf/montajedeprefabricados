// app/(marketing)/tipos/viaductos/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de prefabricados — Viaductos",
    description:
        "Montaje de viaductos de alta velocidad y autovias: vigas prefabricadas, losas, diafragmas y elementos singulares con gruas de alto tonelaje.",
};

export default function ViaductosPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Montaje de viaductos prefabricados
            </h1>

            <p className="mt-3 text-neutral-700">
                Experiencia en viaductos de alta velocidad, autovias y grandes pasos
                con secuencias de izados criticas, radios largos y condicionantes de
                explotacion.
            </p>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Alcance habitual
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Montaje faseado de vigas por vanos completos.</li>
                        <li>Prelosas y losas prefabricadas sobre vigas longitudinales.</li>
                        <li>Apoyos, cunas, diafragmas y elementos de arriostramiento.</li>
                        <li>
                            Coordinacion con hormigonados posteriores y fases de postensado.
                        </li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Control de riesgos
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Analisis HAZID previo a los izados.</li>
                        <li>Vigilancia de viento, accesos y estabilidad temporal.</li>
                        <li>Coordinacion con direccion facultativa y seguridad y salud.</li>
                        <li>Documentacion QA/QC y dossier fotografico de montaje.</li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
