import {describe,expect,it} from "vitest";
import {catalogProducts} from "./catalog";
import {toPublicCatalogProduct} from "../lib/public-catalog";

describe("public catalog projection",()=>{
  it("never serializes internal commercial intelligence",()=>{
    const publicProduct=toPublicCatalogProduct(catalogProducts[0]);
    for(const key of ["commercial","offers","supplier","sourceUrl","imageSource","profit","rotation","badge"]){
      expect(publicProduct).not.toHaveProperty(key);
    }
  });

  it("recalculates public price and VAT from current commercial inputs",()=>{
    const source=catalogProducts[0];
    const changed={...source,commercial:{...source.commercial,cost:100,inboundShipping:10,handling:0,contingencyPercent:0,targetMarginPercent:20,vatPercent:10}};
    const result=toPublicCatalogProduct(changed);
    expect(result.price).toBe(137.5);
    expect(result.priceVat).toBe(151.25);
    expect(result.vatPercent).toBe(10);
  });

  it("only enables purchasing with a verified positive cost and complete evidence",()=>{
    const source=catalogProducts.find(product=>(product.imageUrls?.length??0)>=2)!;
    const offers=[1,2,3].map(index=>({seller:`Proveedor ${index}`,sku:source.supplier.reference,price:100+index,vatIncluded:false,shippingIncluded:false,url:`https://example.com/${index}`,capturedAt:"2026-10-13",country:"ES"}));
    const ready={...source,offers,commercial:{...source.commercial,status:"ready" as const,cost:100,costVerified:true}};
    expect(toPublicCatalogProduct(ready).purchasable).toBe(true);
    expect(toPublicCatalogProduct({...ready,commercial:{...ready.commercial,costVerified:false}}).purchasable).toBe(false);
    expect(toPublicCatalogProduct({...ready,commercial:{...ready.commercial,cost:0}}).purchasable).toBe(false);
  });

  it("presents the verified official PDF for every approved product",()=>{
    const projected=toPublicCatalogProduct(catalogProducts[0]);
    expect(projected.technicalDocument?.url).toMatch(/\.pdf(?:$|[?#])/i);
    expect(projected.canRequestTechnicalDocument).toBe(false);
  });
});
