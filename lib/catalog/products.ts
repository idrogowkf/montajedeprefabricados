import type {CatalogCategory, CatalogProduct} from "./types";

type Seed = [slug: string, name: string, unit: string, summary?: string];

const categoryLabels: Record<CatalogCategory, string> = {
  epi: "Protección y EPI",
  "corte-perforacion": "Corte y perforación",
  "medicion-marcado": "Medición y marcado",
  "fijacion-sellado": "Fijación y sellado",
  "amarre-elevacion": "Amarre y elevación",
  mantenimiento: "Mantenimiento de obra",
};

const seeds: Record<CatalogCategory, Seed[]> = {
  epi: [
    ["guantes-proteccion-mecanica", "Guantes de protección mecánica", "par"],
    ["guantes-anticorte", "Guantes resistentes al corte", "par"],
    ["gafas-transparentes", "Gafas de protección transparentes", "unidad"],
    ["gafas-selladas", "Gafas de protección selladas", "unidad"],
    ["tapones-auditivos-desechables", "Tapones de protección auditiva desechables", "caja"],
    ["orejeras-proteccion-auditiva", "Orejeras de protección auditiva", "unidad"],
    ["chaleco-alta-visibilidad", "Chaleco de alta visibilidad", "unidad"],
    ["casco-obra", "Casco de obra", "unidad"],
    ["barboquejo-casco", "Barboquejo compatible para casco", "unidad"],
    ["mascarilla-particulas", "Mascarilla para partículas", "caja"],
    ["rodilleras-trabajo", "Rodilleras de trabajo", "par"],
    ["crema-proteccion-solar", "Protección solar para trabajo exterior", "unidad"],
  ],
  "corte-perforacion": [
    ["disco-corte-metal-125", "Disco de corte para metal 125 mm", "unidad"],
    ["disco-desbaste-metal-125", "Disco de desbaste para metal 125 mm", "unidad"],
    ["disco-diamante-hormigon-125", "Disco diamantado para hormigón 125 mm", "unidad"],
    ["broca-hormigon-6", "Broca para hormigón 6 mm", "unidad"],
    ["broca-hormigon-8", "Broca para hormigón 8 mm", "unidad"],
    ["broca-hormigon-10", "Broca para hormigón 10 mm", "unidad"],
    ["broca-hormigon-12", "Broca para hormigón 12 mm", "unidad"],
    ["hoja-sierra-metal", "Hoja de sierra para metal", "paquete"],
  ],
  "medicion-marcado": [
    ["cinta-metrica-5m", "Cinta métrica 5 m", "unidad"],
    ["cinta-metrica-8m", "Cinta métrica 8 m", "unidad"],
    ["nivel-magnetico", "Nivel magnético compacto", "unidad"],
    ["marcador-industrial-negro", "Marcador industrial negro", "unidad"],
    ["marcador-pintura-blanco", "Marcador de pintura blanco", "unidad"],
    ["aerosol-marcado-rojo", "Aerosol de marcado rojo", "unidad"],
    ["cordel-trazador", "Cordel trazador", "unidad"],
    ["tiza-marcado", "Tiza de marcado", "caja"],
  ],
  "fijacion-sellado": [
    ["bridas-negras-300", "Bridas negras 300 mm", "bolsa"],
    ["cinta-americana", "Cinta adhesiva técnica reforzada", "rollo"],
    ["cinta-aislante", "Cinta aislante profesional", "rollo"],
    ["sellador-poliuretano", "Sellador de poliuretano", "cartucho"],
    ["silicona-neutra", "Silicona neutra", "cartucho"],
    ["taco-nylon-8", "Taco de nylon 8 mm", "caja"],
    ["taco-nylon-10", "Taco de nylon 10 mm", "caja"],
    ["tornillo-autoperforante", "Tornillo autoperforante", "caja"],
  ],
  "amarre-elevacion": [
    ["cincha-amarre-2t", "Cincha de amarre 2 t", "unidad"],
    ["cincha-amarre-5t", "Cincha de amarre 5 t", "unidad"],
    ["grillete-lira-1t", "Grillete lira 1 t", "unidad"],
    ["grillete-lira-2t", "Grillete lira 2 t", "unidad"],
    ["protector-eslinga", "Protector para eslinga", "unidad"],
    ["eslinga-textil-consulta", "Eslinga textil configurada", "unidad", "Selección bajo consulta según carga, longitud y uso previsto."],
  ],
  mantenimiento: [
    ["aflojatodo", "Aflojatodo de mantenimiento", "aerosol"],
    ["grasa-multiuso", "Grasa multiuso", "cartucho"],
    ["limpiador-industrial", "Limpiador industrial", "unidad"],
    ["toallitas-industriales", "Toallitas de limpieza industrial", "bote"],
    ["pilas-alcalinas-aa", "Pilas alcalinas AA", "paquete"],
    ["pilas-alcalinas-aaa", "Pilas alcalinas AAA", "paquete"],
  ],
};

let index = 0;
export const catalogProducts: CatalogProduct[] = Object.entries(seeds).flatMap(([category, items]) =>
  items.map(([slug, name, unit, summary]) => {
    index += 1;
    const specialized = category === "amarre-elevacion";
    return {
      slug,
      reference: slug === "disco-corte-metal-125" ? "ROT-COR-001" : `ROT-${String(index).padStart(3, "0")}`,
      name,
      category: category as CatalogCategory,
      categoryLabel: categoryLabels[category as CatalogCategory],
      summary: summary ?? "Referencia piloto sujeta a confirmación de fabricante, especificación, precio y disponibilidad.",
      unit,
      priceMode: "quote" as const,
      rotation: specialized ? "bajo-consulta" as const : "alta" as const,
      ...(specialized ? {safetyNote: "La selección final requiere confirmar carga, configuración y uso previsto."} : {}),
    };
  }),
);

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function getCatalogProduct(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function filterCatalogProducts(query = "", category?: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return catalogProducts.filter((product) => {
    if (category && category !== "todos" && product.category !== category) return false;
    const haystack = normalize(`${product.name} ${product.summary} ${product.categoryLabel}`);
    return terms.every((term) => haystack.includes(term));
  });
}
