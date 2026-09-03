// app/(marketing)/tipos/fachadas/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de prefabricados — Fachadas",
    description:
        "Montaje de fachadas prefabricadas: panel arquitectonico, panel sandwich, aplacados y soluciones mixtas con gruas y plataformas elevadoras.",
};

export default function FachadasPage() {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Montaje de fachadas prefabricadas
            </h1>

            <p className="mt-3 text-neutral-700">
                Paneles de fachada arquitectonica, industrial y soluciones mixtas
                (prefabricado + carpinterias) con control de verticalidad, juntas y
                remates.
            </p>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Tipos de fachada
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Panel macizo, aligerado y sandwich.</li>
                        <li>Panel arquitectonico y texturizado.</li>
                        <li>Fachadas con huecos, dinteles y piezas especiales.</li>
                        <li>Integracion con carpinterias, lucernarios y remates metalicos.</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Montaje y coordinacion
                    </h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                        <li>Uso combinado de gruas y plataformas elevadoras.</li>
                        <li>Control de plomada, nivelacion y alineaciones.</li>
                        <li>Sellados, anclajes y fijaciones de proyecto.</li>
                        <li>Gestion de interfaces con cerramientos ligeros.</li>
                    </ul>
                </div>
            </section>
        </main>
    );
}