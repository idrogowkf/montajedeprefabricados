import {describe,expect,it} from "vitest";
import {sanitizeCommercialPatch} from "./catalog-db";

describe("catalog database validation",()=>{
  it("keeps only editable commercial fields and normalizes values",()=>{
    expect(sanitizeCommercialPatch({cost:12.5,targetMarginPercent:30,status:"ready",costVerified:true,evil:"x"})).toEqual({cost:12.5,targetMarginPercent:30,status:"ready",costVerified:true});
  });
  it("rejects invalid commercial values",()=>{
    expect(()=>sanitizeCommercialPatch({cost:-1})).toThrow();
    expect(()=>sanitizeCommercialPatch({status:"published"})).toThrow();
  });
});
