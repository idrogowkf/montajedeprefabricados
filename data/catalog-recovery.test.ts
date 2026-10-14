import {describe,expect,it} from "vitest";
import {catalogProducts} from "./catalog";
import {auditRecoveredProduct,recoveredCatalogProducts} from "./catalog-recovery";

describe("audited catalog recovery",()=>{
  it("restores only the approved functional slices",()=>{
    expect(recoveredCatalogProducts.filter(product=>product.brand==="Hilti"&&product.category==="fijacion")).toHaveLength(60);
    expect(recoveredCatalogProducts.filter(product=>product.brand==="Hilti"&&product.category==="corte")).toHaveLength(20);
    expect(recoveredCatalogProducts.filter(product=>product.brand==="Petzl")).toHaveLength(17);
    expect(recoveredCatalogProducts.every(product=>product.category!==product.brand.toLowerCase())).toBe(true);
    expect(catalogProducts.filter(product=>product.category==="elevacion")).toHaveLength(60);
    expect(catalogProducts).toHaveLength(157);
  });

  it("keeps recovered products on quote until commercial evidence is validated",()=>{
    expect(recoveredCatalogProducts.every(product=>product.commercial.status==="quote")).toBe(true);
    expect(recoveredCatalogProducts.every(product=>product.commercial.cost===0&&!product.commercial.costVerified)).toBe(true);
  });

  it("rejects missing identity, unsafe imagery, editorial records and fake datasheets",()=>{
    const valid=recoveredCatalogProducts[0];
    expect(auditRecoveredProduct({...valid,supplier:{...valid.supplier,reference:""}})).toContain("missing-reference");
    expect(auditRecoveredProduct({...valid,imageUrl:"https://example.com/person-man.jpg",imageUrls:["https://example.com/person-man.jpg"]})).toContain("forbidden-image");
    expect(auditRecoveredProduct({...valid,name:"Artículo editorial",publicDescription:"Noticias y novedades"})).toContain("editorial-content");
    expect(auditRecoveredProduct({...valid,datasheetUrl:"https://example.com/product"})).toContain("non-pdf-datasheet");
  });

  it("does not reintroduce portraits, QR artwork or brand categories",()=>{
    for(const product of recoveredCatalogProducts){
      expect(auditRecoveredProduct(product)).toEqual([]);
      expect(["hilti","petzl","kratos","3m","wimag","elebia","pfeifer"]).not.toContain(product.category);
    }
  });
});
