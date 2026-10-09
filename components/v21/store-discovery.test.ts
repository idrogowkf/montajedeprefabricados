import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {catalogProducts,isStorefrontComplete} from "../../data/catalog";
import {selectFeaturedStoreProducts} from "../../data/featured-store";

describe("landing catalog discovery",()=>{
  it("renders the same verified product images used by the store",()=>{
    const source=readFileSync(join(process.cwd(),"components/v21/StoreDiscovery.tsx"),"utf8");
    expect(source).toContain("selectFeaturedStoreProducts");
    expect(source).toContain("<img");
    expect(source).not.toContain("IMAGEN PROVISIONAL");
    expect(source).not.toContain("precios demostrativos");
  });
  it("only links landing cards that can open a complete storefront product",()=>{
    const products=selectFeaturedStoreProducts(catalogProducts);
    expect(products).toHaveLength(6);
    expect(products.every(isStorefrontComplete)).toBe(true);
    expect(products.some(product=>product.id==="disco-diamante-230")).toBe(false);
  });
});
