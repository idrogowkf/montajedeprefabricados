import React from "react";
import {createRequire} from "node:module";
import {describe,expect,it,vi} from "vitest";
import {catalogProducts} from "../../data/catalog";
import {toPublicCatalogProduct} from "../../lib/public-catalog";
import {CatalogSearch,nextCatalogSearchIndex,resolveCatalogSearchAction} from "./CatalogSearch";

const products=catalogProducts.map(toPublicCatalogProduct);
const {renderToStaticMarkup}=createRequire(import.meta.url)("react-dom/server") as {renderToStaticMarkup:(element:React.ReactNode)=>string};

describe("predictive catalog search",()=>{
  it("renders an accessible grouped combobox with bounded suggestions and assisted search",()=>{
    const html=renderToStaticMarkup(React.createElement(CatalogSearch,{products,query:"perforar",onQueryChange:vi.fn(),onNavigate:vi.fn(),onAssistedSearch:vi.fn()}));
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain("Categoría");
    expect(html).toContain("Aplicación");
    expect(html).toContain("Ayúdame a elegir");
    expect((html.match(/role="option"/g)??[]).length).toBeLessThanOrEqual(8);
  });

  it("moves focus predictably with arrows and closes with Escape",()=>{
    expect(nextCatalogSearchIndex(-1,"ArrowDown",5)).toBe(0);
    expect(nextCatalogSearchIndex(4,"ArrowDown",5)).toBe(0);
    expect(nextCatalogSearchIndex(0,"ArrowUp",5)).toBe(4);
    expect(nextCatalogSearchIndex(2,"Escape",5)).toBe(-1);
  });

  it("routes each suggestion internally without an external URL",()=>{
    expect(resolveCatalogSearchAction({type:"product",id:"p1",label:"P",detail:"Producto"})).toEqual({kind:"product",value:"p1"});
    expect(resolveCatalogSearchAction({type:"category",id:"corte",label:"Corte",detail:"Categoría"})).toEqual({kind:"category",value:"corte"});
    expect(resolveCatalogSearchAction({type:"application",id:"perforar-hormigon",label:"Perforar",detail:"Aplicación"})).toEqual({kind:"application",value:"perforar-hormigon"});
    expect(resolveCatalogSearchAction({type:"brand",id:"Hilti",label:"Hilti",detail:"Marca"})).toEqual({kind:"brand",value:"Hilti"});
    expect(resolveCatalogSearchAction({type:"assisted",id:"assisted",label:"Ayuda",detail:"Selector"})).toEqual({kind:"assisted"});
  });
});
