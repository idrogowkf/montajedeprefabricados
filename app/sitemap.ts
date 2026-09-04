import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://montajesprefabricados.com";

  const tipos = [
    "naves-industriales",
    "puentes",
    "viaductos",
    "fachadas",
    "cerramientos",
    "otras-tipologias",
  ];

  const ciudades = [
    "madrid",
    "barcelona",
    "valencia",
    "sevilla",
    "mallorca",
    "zaragoza",
    "bilbao",
    "malaga",
    "murcia",
    "alicante"
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

    ...ciudades.map((c) => ({
      url: `${base}/${c}`,
      priority: 0.8,
    })),
  ];
}
