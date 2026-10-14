import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {catalogProducts,hasStoreImage} from "../../data/catalog";
import {selectFeaturedStoreProducts} from "../../data/featured-store";
import {parseCatalogState} from "../../data/catalog-search";

describe("landing catalog discovery",()=>{
  it("renders the same verified product images used by the store",()=>{
    const source=readFileSync(join(process.cwd(),"components/v21/StoreDiscovery.tsx"),"utf8");
    expect(source).toContain("selectFeaturedStoreProducts");
    expect(source).toContain("getCatalog");
    expect(source).toContain("<img");
    expect(source).not.toContain("IMAGEN PROVISIONAL");
    expect(source).not.toContain("precios demostrativos");
  });
  it("features real public products from multiple functional categories",()=>{
    const products=selectFeaturedStoreProducts(catalogProducts);
    expect(products).toHaveLength(6);
    expect(products.every(hasStoreImage)).toBe(true);
    expect(new Set(products.map(product=>product.category)).size).toBeGreaterThanOrEqual(4);
  });
  it("makes the professional store, six categories, assisted selection and full catalog explicit",()=>{
    const header=readFileSync(join(process.cwd(),"components/v21/Header.tsx"),"utf8");
    const hero=readFileSync(join(process.cwd(),"components/v21/Hero.tsx"),"utf8");
    const discovery=readFileSync(join(process.cwd(),"components/v21/StoreDiscovery.tsx"),"utf8");
    expect(header).toContain("Tienda profesional");
    expect(hero).toContain("gateway-search");
    for(const category of ["elevacion","fijacion","corte","altura","epi","sellado"]){
      const href=`/tienda?category=${category}`;
      expect(hero).toContain(href);
      expect(parseCatalogState(href.split("?")[1]).categories).toContain(category);
    }
    expect(discovery).toContain("MANIPULA Y MONTA");
    expect(discovery).toContain("/tienda?ayuda=1");
    expect(parseCatalogState("ayuda=1").assisted).toBe(true);
    expect(discovery).toContain('href="/tienda"');
  });
});
