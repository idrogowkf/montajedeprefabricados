import { describe, expect, it } from "vitest";
import { catalogProducts, filterCatalog } from "./catalog";

describe("multifaceted catalog", () => {
  it("covers safety and the principal prefabricated materials", () => {
    expect(catalogProducts.length).toBeGreaterThanOrEqual(24);
    for (const segment of ["altura", "hormigon", "acero", "madera", "pvc"]) {
      expect(catalogProducts.some((product) => product.segments.includes(segment as never))).toBe(true);
    }
  });

  it("finds lifelines and wind equipment by plain language", () => {
    expect(filterCatalog(catalogProducts, "linea de vida", "todos").length).toBeGreaterThanOrEqual(2);
    expect(filterCatalog(catalogProducts, "eolico", "todos").some((product) => product.name.toLowerCase().includes("arnés"))).toBe(true);
  });

  it("keeps source and commercial readiness traceable", () => {
    expect(catalogProducts.every((product) => product.supplier.name && product.sourceUrl && product.commercial.status)).toBe(true);
  });
});
