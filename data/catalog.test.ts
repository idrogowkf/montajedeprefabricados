import { describe, expect, it } from "vitest";
import { catalogProducts, filterCatalog, filterStoreCatalog, hasStoreImage, isPublicationReady } from "./catalog";

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

  it("attaches three same-SKU market offers and a real photo to compared products",()=>{
    for(const id of ["arnes-anticaidas","anticaidas-retractil","disco-diamante-230"]){
      const product=catalogProducts.find(item=>item.id===id)!;
      expect(product.imageUrl).toMatch(/^https:\/\//);
      expect(product.offers).toHaveLength(3);
      expect(new Set(product.offers.map(offer=>offer.sku))).toEqual(new Set([product.supplier.reference]));
    }
  });

  it("never publishes incomplete or generic records",()=>{
    expect(catalogProducts.filter(isPublicationReady).every(product=>(product.imageUrls?.length??0)>=2&&Boolean(product.datasheetUrl)&&product.offers.length===3&&product.supplier.reference!=="PENDIENTE")).toBe(true);
  });

  it("does not classify the concrete lifeline post as steel",()=>{
    const post=catalogProducts.find(product=>product.id==="poste-linea-vida")!;
    expect(post.segments).toContain("hormigon");
    expect(post.segments).not.toContain("acero");
  });

  it("does not invent purchase costs for unidentified products",()=>{
    const unidentified=catalogProducts.filter(product=>product.supplier.reference==="PENDIENTE");
    expect(unidentified.every(product=>product.commercial.cost===0&&product.price===0)).toBe(true);
  });

  it("separates commercial family from prefabricated material",()=>{
    const concreteCutting=filterStoreCatalog(catalogProducts,"","corte","hormigon");
    expect(concreteCutting.length).toBeGreaterThan(0);
    expect(concreteCutting.every(product=>product.segments.includes("corte")&&product.segments.includes("hormigon"))).toBe(true);
    expect(filterStoreCatalog(catalogProducts,"","altura","acero").every(product=>product.segments.includes("altura")&&product.segments.includes("acero"))).toBe(true);
  });

  it("shows only products with a verified storefront image",()=>{
    expect(catalogProducts.filter(hasStoreImage).length).toBeGreaterThan(0);
    expect(catalogProducts.filter(hasStoreImage).every(product=>Boolean(product.imageUrl)||(product.imageUrls?.length??0)>0)).toBe(true);
  });
});
