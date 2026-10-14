import {describe,expect,it} from "vitest";
import {
  catalogApplications,
  catalogCategories,
  catalogSynonyms,
  isCatalogCategory,
} from "./catalog-taxonomy";

describe("functional catalog taxonomy",()=>{
  it("exposes seven unique functional categories and never turns a brand into one",()=>{
    expect(catalogCategories.map(category=>category.id)).toEqual([
      "elevacion","fijacion","corte","epi","altura","sellado","utiles",
    ]);
    expect(new Set(catalogCategories.map(category=>category.id)).size).toBe(7);
    expect(catalogCategories.map(category=>category.label)).toEqual([
      "Elevación, izaje y manipulación",
      "Fijación y montaje",
      "Corte y perforación",
      "Protección y EPI",
      "Trabajos en altura",
      "Sellado y reparación",
      "Útiles y accesorios de montaje",
    ]);
    const labels=catalogCategories.map(category=>category.label.toLowerCase()).join(" ");
    for(const brand of ["hilti","petzl","kratos","3m","wimag","elebia","pfeifer"]){
      expect(labels).not.toContain(brand);
    }
    expect(isCatalogCategory("elevacion")).toBe(true);
    expect(isCatalogCategory("hilti")).toBe(false);
  });

  it("groups the approved Spanish work-language synonyms",()=>{
    expect(catalogSynonyms.pozos).toEqual(expect.arrayContaining(["pozo","arqueta","anillo","registro"]));
    expect(catalogSynonyms.elevar).toEqual(expect.arrayContaining(["elevar","izar","levantar","coger","manipular"]));
    expect(catalogSynonyms.perforar).toEqual(expect.arrayContaining(["taladrar","perforar"]));
    expect(catalogSynonyms.fijar).toEqual(expect.arrayContaining(["taco","anclaje","fijacion","perno"]));
  });

  it("keeps applications tied to functional categories",()=>{
    expect(catalogApplications.find(application=>application.id==="manipular-prefabricado")?.category).toBe("elevacion");
    expect(catalogApplications.find(application=>application.id==="perforar-hormigon")?.category).toBe("corte");
  });
});
