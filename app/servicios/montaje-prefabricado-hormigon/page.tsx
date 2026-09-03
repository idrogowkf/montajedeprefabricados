import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Montaje de Prefabricado de Hormigón en España",
    description:
        "Montaje profesional de prefabricados de hormigón: vigas, dovelas, paneles, forjados, pilares y elementos especiales. Servicio en toda España.",
    alternates: {
        canonical: "https://montajesprefabricados.com/servicios/montaje-prefabricado-hormigon",
    },
};

export default function Page() {
    return (
        <main className="px-6 py-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">
                Montaje de Prefabricado de Hormigón en España
            </h1>

            <p className="text-lg mb-6">
                Somos especialistas en montaje de prefabricados de hormigón para obras
                civiles, edificación industrial y proyectos de infraestructura.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">
                ¿Qué elementos montamos?
            </h2>
            <ul className="list-disc ml-6">
                <li>Vigas prefabricadas</li>
                <li>Pilares</li>
                <li>Paneles de fachada</li>
                <li>Forjados alveolares</li>
                <li>Dovelas</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-3">
                Ámbito de actuación
            </h2>
            <p>
                Realizamos montajes en todas las provincias de España. Coordinamos grúas,
                transporte, equipos de montaje y planificación.
            </p>

            <a
                className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg"
                href="/presupuesto"
            >
                Solicitar presupuesto
            </a>
        </main>
    );
}
