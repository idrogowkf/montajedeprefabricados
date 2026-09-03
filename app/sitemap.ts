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

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/presupuesto`, priority: 0.9 },

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
