import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("landing catalog discovery",()=>{
  it("renders the same verified product images used by the store",()=>{
    const source=readFileSync(join(process.cwd(),"components/v21/StoreDiscovery.tsx"),"utf8");
    expect(source).toContain("hasStoreImage");
    expect(source).toContain("<img");
    expect(source).not.toContain("IMAGEN PROVISIONAL");
    expect(source).not.toContain("precios demostrativos");
  });
});
