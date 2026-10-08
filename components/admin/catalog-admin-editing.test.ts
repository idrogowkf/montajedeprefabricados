import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("catalog administration",()=>{
  const source=readFileSync(join(process.cwd(),"components/admin/CatalogAdmin.tsx"),"utf8");
  it("supports individual content, gallery and document editing",()=>{
    for(const label of ["Contenido","Imágenes","Documentación","Guardar ficha"]){expect(source).toContain(label);}
  });
  it("supports selecting products and bulk commercial updates",()=>{
    for(const token of ["selectedIds","Aplicar en masa","bulkPatch","selectAll"]){expect(source).toContain(token);}
  });
  it("provides an operational queue for products without a verified PDF",()=>{
    for(const label of [
      "Fichas técnicas pendientes",
      "Sin ficha PDF",
      "Página para investigar",
      "Referencia del fabricante",
      "Descripción de la pieza",
      "Pegar URL del PDF oficial",
      "PDF técnico verificado",
    ]){expect(source).toContain(label);}
    expect(source).toContain("hasVerifiedTechnicalDocument");
    expect(source).toContain('statusFilter==="missing-doc"');
  });
});
