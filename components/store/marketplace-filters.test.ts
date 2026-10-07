import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("store taxonomy controls",()=>{
  it("exposes assembly tools as a dedicated product family",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).not.toContain('from "@/data/catalog"');
    expect(source).toContain('["utiles","Útiles de montaje"]');
  });
  it("uses product families in navigation and a separate prefabricated-material filter",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain("Familias de producto");
    expect(source).toContain("Tipo de prefabricado");
    expect(source).toContain("Hormigón");
    expect(source).toContain("Acero");
    expect(source).toContain("Madera");
    expect(source).not.toContain('title="Altura y líneas de vida"');
  });
  it("keeps commercial intelligence out of the public storefront",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    for(const internalLabel of ["ROTACIÓN ALTA","Fuente de mercado","Fuentes de mercado","margen objetivo"]){
      expect(source).not.toContain(internalLabel);
    }
    for(const publicLabel of ["Precio sin IVA","vatPercent","Total con IVA","Transporte"]){
      expect(source).toContain(publicLabel);
    }
  });
  it("offers assisted sourcing and keeps the filter panel legible",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    const css=readFileSync(join(process.cwd(),"app/catalog-enhancements.css"),"utf8");
    expect(source).toContain("¿No encuentras lo que buscas?");
    expect(source).toContain("Te lo buscamos");
    expect(css).toContain(".store-mock .filters");
    expect(css).toContain("background:#fff");
  });
});
