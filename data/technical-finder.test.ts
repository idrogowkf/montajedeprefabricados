import {describe,expect,it} from "vitest";
import {catalogProducts} from "./catalog";
import {toPublicCatalogProduct} from "../lib/public-catalog";
import {findTechnicalCandidates,nextFinderStep,previousFinderStep,type TechnicalFinderState} from "./technical-finder";

const products=catalogProducts.map(toPublicCatalogProduct);

describe("guided technical finder rules",()=>{
  it("routes the four primary work intents",()=>{
    expect(findTechnicalCandidates(products,{intent:"fijacion",piece:"placa base",material:"hormigón"})[0]?.product.category).toBe("fijacion");
    expect(findTechnicalCandidates(products,{intent:"corte",piece:"losa",material:"hormigón"})[0]?.product.category).toBe("corte");
    expect(findTechnicalCandidates(products,{intent:"altura",piece:"aerogenerador",material:"acero"})[0]?.product.category).toBe("altura");
    expect(findTechnicalCandidates(products,{intent:"elevacion",piece:"arqueta",material:"hormigón"})[0]?.product.category).toBe("elevacion");
  });

  it("never marks lifting equipment compatible without load and geometry",()=>{
    const incomplete=findTechnicalCandidates(products,{intent:"elevacion",piece:"arqueta",material:"hormigón"});
    expect(incomplete.length).toBeGreaterThan(0);
    expect(incomplete.every(candidate=>candidate.status==="requires-review")).toBe(true);
    expect(incomplete.flatMap(candidate=>candidate.reasons)).toEqual(expect.arrayContaining(["Falta indicar el peso de la pieza","Faltan dimensiones o geometría de agarre"]));
  });

  it("marks only a fully documented, dimensionally valid lifting fixture compatible",()=>{
    const source=products.find(product=>product.category==="elevacion")!;
    const fixture={...source,technicalAttributes:{capacityKg:2000,minOpeningMm:400,maxOpeningMm:1200},pieceTypes:["arqueta"],materials:["hormigón"]};
    const state:TechnicalFinderState={intent:"elevacion",piece:"arqueta",material:"hormigón",weightKg:1200,dimensions:"diámetro 800 mm",openingMm:800};
    expect(findTechnicalCandidates([fixture],state)[0]).toMatchObject({status:"compatible",reasons:[]});
    expect(findTechnicalCandidates([fixture],{...state,weightKg:2500})[0].status).toBe("requires-review");
  });

  it("keeps incomplete non-lifting records under review",()=>{
    const hilti=products.find(product=>product.category==="fijacion")!;
    expect(findTechnicalCandidates([hilti],{intent:"fijacion",piece:"placa base",material:"hormigón"})[0].status).toBe("requires-review");
  });

  it("advances and returns across empty and completed steps",()=>{
    expect(nextFinderStep({})).toBe("intent");
    expect(nextFinderStep({intent:"elevacion"})).toBe("context");
    expect(nextFinderStep({intent:"elevacion",piece:"arqueta",material:"hormigón"})).toBe("details");
    expect(nextFinderStep({intent:"elevacion",piece:"arqueta",material:"hormigón",weightKg:1000,dimensions:"800 mm"})).toBe("results");
    expect(previousFinderStep("details")).toBe("context");
  });
});
