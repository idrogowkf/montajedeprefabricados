import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("catalog administration",()=>{
  it("exposes pricing, supplier and operations controls",()=>{
    const source=readFileSync(join(process.cwd(),"components/admin/CatalogAdmin.tsx"),"utf8");
    for(const label of ["Coste de compra","Margen objetivo","Beneficio bruto","Proveedor","Bandeja operativa","Publicable"]){expect(source).toContain(label)}
    expect(source).toContain("/api/admin/catalog");
    expect(source).not.toContain("localStorage");
    expect(source).toContain("catalogCategories");
    for(const label of ["Categoría","Aplicación","Tipo de pieza","Material","Marca","Calidad documental"]){expect(source).toContain(label)}
    for(const marker of ["Referencia duplicada","Imagen pendiente","Sin ficha PDF"]){expect(source).toContain(marker)}
    expect(source).not.toContain('<option value="hilti">');
    expect(source).toContain("Aplicar en masa");
    expect(source).toContain("Estado de publicación");
    expect(source).toContain('statusFilter===\"todos\"');
  });
});
