import {describe, expect, it} from "vitest";
import {catalogProducts, filterCatalogProducts, getCatalogProduct} from "./products";
import {calculateCatalogSummary} from "./metrics";

describe("rotation catalog", () => {
  it("publishes 48 unique pilot references without unverified claims", () => {
    expect(catalogProducts).toHaveLength(48);
    expect(new Set(catalogProducts.map((product) => product.slug)).size).toBe(48);
    expect(catalogProducts.every((product) => !product.name.toLowerCase().includes("homologado"))).toBe(true);
    expect(catalogProducts.every((product) => product.priceMode === "quote")).toBe(true);
  });

  it("filters by category and normalized search text", () => {
    const results = filterCatalogProducts("proteccion auditiva", "epi");
    expect(results.map((product) => product.slug)).toContain("tapones-auditivos-desechables");
    expect(results.every((product) => product.category === "epi")).toBe(true);
  });

  it("finds a product by slug", () => {
    expect(getCatalogProduct("disco-corte-metal-125")?.reference).toBe("ROT-COR-001");
    expect(getCatalogProduct("inexistente")).toBeUndefined();
  });
});

describe("catalog funnel", () => {
  it("calculates product funnel and conversion", () => {
    const summary = calculateCatalogSummary([
      {type: "product_view", productSlug: "a"},
      {type: "product_view", productSlug: "a"},
      {type: "cart_add", productSlug: "a"},
      {type: "rfq_submitted", productSlug: "a"},
    ]);

    expect(summary).toEqual({views: 2, cartAdds: 1, rfqs: 1, viewToRfqRate: 50});
  });

  it("returns a zero rate when there are no views", () => {
    expect(calculateCatalogSummary([]).viewToRfqRate).toBe(0);
  });
});
