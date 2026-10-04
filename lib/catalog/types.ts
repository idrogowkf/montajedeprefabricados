export const catalogCategories = ["epi", "corte-perforacion", "medicion-marcado", "fijacion-sellado", "amarre-elevacion", "mantenimiento"] as const;

export type CatalogCategory = (typeof catalogCategories)[number];

export type CatalogProduct = {
  slug: string;
  reference: string;
  name: string;
  category: CatalogCategory;
  categoryLabel: string;
  summary: string;
  unit: string;
  priceMode: "quote";
  rotation: "alta" | "media" | "bajo-consulta";
  safetyNote?: string;
};

export type CatalogEvent = {
  type: "product_view" | "cart_add" | "rfq_submitted";
  productSlug: string;
};
