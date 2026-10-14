import React from "react";
import {createRequire} from "node:module";
import {describe,expect,it,vi} from "vitest";
import {catalogProducts} from "../../data/catalog";
import {toPublicCatalogProduct} from "../../lib/public-catalog";
import {formatTechnicalRequest} from "../../data/technical-finder";
import {TechnicalFinder} from "./TechnicalFinder";

const {renderToStaticMarkup}=createRequire(import.meta.url)("react-dom/server") as {renderToStaticMarkup:(element:React.ReactNode)=>string};
const products=catalogProducts.map(toPublicCatalogProduct);

describe("technical finder panel",()=>{
  it("renders progress, dependent context controls and an editable summary",()=>{
    const html=renderToStaticMarkup(React.createElement(TechnicalFinder,{products,initialIntent:"elevacion",onResults:vi.fn(),onRequest:vi.fn(),onClose:vi.fn()}));
    expect(html).toContain("Selector técnico");
    expect(html).toContain("Paso 2 de 4");
    expect(html).toContain("¿Qué pieza necesitas manipular?");
    expect(html).toContain("Material");
    expect(html).toContain("Volver");
  });

  it("formats every answer for transfer to the inquiry form",()=>{
    const message=formatTechnicalRequest({intent:"elevacion",piece:"arqueta",material:"hormigón",dimensions:"Ø 800 mm",weightKg:1200,conditions:"Exterior",delivery:"28001"});
    for(const value of ["elevacion","arqueta","hormigón","Ø 800 mm","1200 kg","Exterior","28001"])expect(message).toContain(value);
  });
});
