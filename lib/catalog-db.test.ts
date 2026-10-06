import {describe,expect,it} from "vitest";
import {mergeCatalogCommercial,sanitizeCommercialPatch} from "./catalog-db";
import {catalogProducts} from "../data/catalog";

describe("catalog database validation",()=>{
  it("keeps only editable commercial fields and normalizes values",()=>{
    expect(sanitizeCommercialPatch({cost:12.5,targetMarginPercent:30,status:"ready",costVerified:true,evil:"x"})).toEqual({cost:12.5,targetMarginPercent:30,status:"ready",costVerified:true});
  });
  it("rejects invalid commercial values",()=>{
    expect(()=>sanitizeCommercialPatch({cost:-1})).toThrow();
    expect(()=>sanitizeCommercialPatch({status:"published"})).toThrow();
  });
});

describe("catalog database merge",()=>{
  it("keeps audited product media while preserving admin commercial edits",()=>{
    const source=catalogProducts.find(product=>product.id==="disco-diamante-230")!;
    const stale={...source,imageUrl:"https://example.com/stale.jpg"};
    const commercial={...source.commercial,targetMarginPercent:41,status:"draft" as const,costVerified:false};
    const merged=mergeCatalogCommercial([{payload:stale,commercial}]).find(product=>product.id===source.id)!;
    expect(merged.imageUrl).toBe(source.imageUrl);
    expect(merged.commercial.targetMarginPercent).toBe(41);
    expect(merged.commercial.status).toBe("draft");
    expect(merged.commercial.costVerified).toBe(false);
  });
});
