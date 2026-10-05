import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";
describe("internal market comparison",()=>{it("lives in administration and records freshness and source",()=>{const admin=readFileSync(join(process.cwd(),"components/admin/PriceAudit.tsx"),"utf8");const store=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");expect(admin).toContain("Elegir precio web");expect(admin).toContain("capturedAt");expect(admin).toContain("Actualización manual");expect(store).not.toContain("Comparativa de mercado")})});
