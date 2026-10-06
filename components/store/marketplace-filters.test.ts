import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("store taxonomy controls",()=>{
  it("uses product families in navigation and a separate prefabricated-material filter",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain("Familias de producto");
    expect(source).toContain("Tipo de prefabricado");
    expect(source).toContain("Hormigón");
    expect(source).toContain("Acero");
    expect(source).toContain("Madera");
    expect(source).not.toContain('title="Altura y líneas de vida"');
  });
  it("renders traceable reference pricing before purchase approval",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain("Precio de referencia");
    expect(source).toContain("Fuente de mercado");
  });
});
