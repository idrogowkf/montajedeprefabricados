import {describe, expect, it} from "vitest";
import {filterProducts, mockProducts} from "./store-mock";

describe("marketplace mock data", () => {
  it("offers a representative twelve-product catalogue", () => {
    expect(mockProducts).toHaveLength(12);
    expect(new Set(mockProducts.map((product) => product.id)).size).toBe(12);
  });

  it("filters by normalized search and category", () => {
    expect(filterProducts(mockProducts, "proteccion", "epi").map((product) => product.id)).toContain("casco-obra");
    expect(filterProducts(mockProducts, "", "corte").every((product) => product.category === "corte")).toBe(true);
  });
});
