import {describe,expect,it} from "vitest";
import {catalogProducts} from "./catalog";
import {toPublicCatalogProduct} from "../lib/public-catalog";
import {buildFacets,parseCatalogState,searchCatalog,serializeCatalogState,suggestCatalog} from "./catalog-search";

const products=catalogProducts.map(toPublicCatalogProduct);

describe("catalog intent search",()=>{
  it.each([
    ["coger arqueta","elevacion"],
    ["perforar hormigón","corte"],
    ["fijar placa base","fijacion"],
    ["arnés eólico","altura"],
  ])("maps %s to the intended functional category",(query,category)=>{
    const results=searchCatalog(products,{query});
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe(category);
  });

  it("normalizes accents, simple plurals and empty queries",()=>{
    expect(searchCatalog(products,{query:"balancines"})[0]?.name.toLowerCase()).toContain("balanc");
    expect(searchCatalog(products,{query:"elevacion"}).length).toBeGreaterThan(0);
    expect(searchCatalog(products,{query:""})).toHaveLength(products.length);
  });

  it("ranks an exact manufacturer reference before descriptive matches",()=>{
    const target=products.find(product=>product.reference==="r11219549")!;
    expect(searchCatalog(products,{query:"r11219549"})[0].id).toBe(target.id);
  });

  it("requires every meaningful word so natural-language searches stay relevant",()=>{
    const results=searchCatalog(products,{query:"pinza para pozos"});
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(30);
    expect(results.every(product=>{
      const text=`${product.name} ${product.description} ${product.applications.join(" ")} ${product.pieceTypes.join(" ")}`.toLowerCase();
      return text.includes("pinza")&&(text.includes("pozo")||text.includes("anillo")||text.includes("arqueta"));
    })).toBe(true);
  });

  it("suggests products, categories, applications, brands and assisted search within the limit",()=>{
    const suggestions=suggestCatalog(products,"perforar",6);
    expect(suggestions).toHaveLength(6);
    expect(suggestions.some(item=>item.type==="product")).toBe(true);
    expect(suggestions.some(item=>item.type==="category"||item.type==="application")).toBe(true);
    expect(suggestions.at(-1)?.type).toBe("assisted");
  });
});

describe("catalog facets and URL state",()=>{
  it("filters by functional category and builds counts from the current result set",()=>{
    const state={query:"",categories:["fijacion" as const]};
    expect(searchCatalog(products,state)).toHaveLength(60);
    const facets=buildFacets(products,state);
    expect(facets.brands.find(option=>option.value==="Hilti")).toMatchObject({count:60,disabled:false});
    expect(facets.brands.find(option=>option.value==="Petzl")).toMatchObject({count:0,disabled:true});
  });

  it("round-trips known state and ignores unknown legacy parameters",()=>{
    const expected={query:"pinza",categories:["elevacion" as const],brands:["WIMAG"],materials:["hormigón"],hasDocument:true,commercialMode:"quote" as const};
    const encoded=serializeCatalogState(expected);
    expect(parseCatalogState(encoded)).toEqual(expected);
    expect(parseCatalogState(new URLSearchParams("category=hilti&segment=old&unknown=x"))).toEqual({query:""});
  });

  it("does not mutate the source collection while calculating facets",()=>{
    const before=products.map(product=>product.id);
    buildFacets(products,{query:"arnés"});
    expect(products.map(product=>product.id)).toEqual(before);
  });
});
