import { MetadataRoute } from "next";

import { cities } from "../lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.montajedeprefabricados.com";

  const tipos = [
    "naves-industriales",
    "puentes",
    "viaductos",
    "fachadas",
    "cerramientos",
    "otras-tipologias",
  ];

  const servicios = ["montaje-prefabricados","ingenieria-de-montaje","lifting-plan","gruas-y-maniobras","logistica-de-obra","asistencia-tecnica"];

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/presupuesto`, priority: 0.9 },
    ...servicios.map((service)=>({url:`${base}/servicios/${service}`,priority:service==="lifting-plan" ? 0.95 : 0.9})),

    ...tipos.map((t) => ({
      url: `${base}/tipos/${t}`,
      priority: 0.85,
    })),

    ...cities.map((c) => ({
      url: `${base}/${c}`,
      priority: 0.8,
    })),
  ];
}
