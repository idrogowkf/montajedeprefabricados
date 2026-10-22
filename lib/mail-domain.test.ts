import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("mail fallbacks",()=>{
  it("uses the verified company domain everywhere",()=>{
    const source=["lib/auth.ts","app/api/prestudy/route.ts","app/api/product-inquiries/route.ts"]
      .map(file=>readFileSync(join(process.cwd(),file),"utf8")).join("\n");
    expect(source).not.toContain("montajesprefabricados.com");
    expect(source).toContain("ofertas@montajedeprefabricados.com");
  });
});
