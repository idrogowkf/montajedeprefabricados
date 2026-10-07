import {describe,expect,it} from "vitest";
import {sanitizeCatalogPatch} from "./catalog-db";

describe("catalog content patch",()=>{
  it("keeps only editable content and normalizes gallery URLs",()=>{
    const patch=sanitizeCatalogPatch({name:"  Producto ",publicDescription:" Descripción ",imageUrls:["https://a.test/1.jpg","https://a.test/2.jpg"],datasheetUrl:"https://a.test/ficha.pdf"});
    expect(patch).toEqual({name:"Producto",publicDescription:"Descripción",imageUrls:["https://a.test/1.jpg","https://a.test/2.jpg"],imageUrl:"https://a.test/1.jpg",datasheetUrl:"https://a.test/ficha.pdf"});
  });
  it("rejects unsafe technical document URLs",()=>{
    expect(()=>sanitizeCatalogPatch({datasheetUrl:"javascript:alert(1)"})).toThrow("URL");
    expect(()=>sanitizeCatalogPatch({imageUrls:["https://a.test/1.jpg","javascript:bad"]})).toThrow("línea 2");
  });
});
