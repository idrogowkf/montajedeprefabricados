import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("catalog administration",()=>{
  it("exposes pricing, supplier and operations controls",()=>{
    const source=readFileSync(join(process.cwd(),"components/admin/CatalogAdmin.tsx"),"utf8");
    for(const label of ["Coste de compra","Margen objetivo","Beneficio bruto","Proveedor","Bandeja operativa","Publicación"]){expect(source).toContain(label)}
    expect(source).toContain("/api/admin/catalog");
    expect(source).not.toContain("localStorage");
    expect(source).toContain("Material / sistema");
    expect(source).toContain("Tipo de producto");
    expect(source).toContain("Estado de publicación");
    expect(source).toContain('statusFilter===\"todos\"');
  });
});
