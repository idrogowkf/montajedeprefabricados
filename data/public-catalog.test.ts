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
    const source=catalogProducts.find(product=>product.id==="disco-diamante-230")!;
    const changed={...source,commercial:{...source.commercial,cost:100,inboundShipping:10,handling:0,contingencyPercent:0,targetMarginPercent:20,vatPercent:10}};
    const result=toPublicCatalogProduct(changed);
    expect(result.price).toBe(137.5);
    expect(result.priceVat).toBe(151.25);
    expect(result.vatPercent).toBe(10);
  });

  it("only enables purchasing with a verified positive cost and complete evidence",()=>{
    const source=catalogProducts.find(product=>product.id==="disco-diamante-230")!;
    expect(toPublicCatalogProduct(source).purchasable).toBe(true);
    expect(toPublicCatalogProduct({...source,commercial:{...source.commercial,costVerified:false}}).purchasable).toBe(false);
    expect(toPublicCatalogProduct({...source,commercial:{...source.commercial,cost:0}}).purchasable).toBe(false);
  });
});
