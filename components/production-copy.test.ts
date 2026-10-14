import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

const files=[
  "components/store/MarketplaceMockup.tsx",
  "components/admin/CatalogAdmin.tsx",
  "components/v21/Hero.tsx",
  "app/tienda/tienda.css",
  "app/hybrid-home.css",
];

describe("production-facing copy",()=>{
  it("contains no demo, preview or test-environment traces",()=>{
    const source=files.map(file=>readFileSync(join(process.cwd(),file),"utf8")).join("\n");
    for(const forbidden of ["demo","preview","catálogo en preparación","para probar el recorrido"]){
      expect(source.toLowerCase()).not.toContain(forbidden);
    }
  });
});
