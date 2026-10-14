import React from "react";
import {createRequire} from "node:module";
import {describe,expect,it,vi} from "vitest";
import {catalogProducts} from "../../data/catalog";
import {buildFacets,type CatalogSearchState} from "../../data/catalog-search";
import {toPublicCatalogProduct} from "../../lib/public-catalog";
import {CatalogFilters,activeCatalogFilterCount,clearCatalogFacet,toggleCatalogFacet} from "./CatalogFilters";

const {renderToStaticMarkup}=createRequire(import.meta.url)("react-dom/server") as {renderToStaticMarkup:(element:React.ReactNode)=>string};
const products=catalogProducts.map(toPublicCatalogProduct);

describe("faceted catalog filters",()=>{
  it("renders functional facets, counts, disabled options and the mobile summary",()=>{
    const state:CatalogSearchState={query:"",categories:["fijacion"]};
    const html=renderToStaticMarkup(React.createElement(CatalogFilters,{facets:buildFacets(products,state),state,onChange:vi.fn(),onClear:vi.fn()}));
    expect(html).toContain("Fijación y montaje");
    expect(html).toContain("Hilti");
    expect(html).toContain("60");
    expect(html).toContain("Filtros (1)");
    expect(html).toContain("disabled");
    expect(html).toContain("Limpiar todos");
  });

  it("toggles and clears one facet without losing the query",()=>{
    const initial:CatalogSearchState={query:"anclaje",categories:["fijacion"],brands:["Hilti"]};
    expect(toggleCatalogFacet(initial,"brands","Petzl")).toEqual({...initial,brands:["Hilti","Petzl"]});
    expect(toggleCatalogFacet(initial,"brands","Hilti")).toEqual({query:"anclaje",categories:["fijacion"]});
    expect(clearCatalogFacet(initial,"categories")).toEqual({query:"anclaje",brands:["Hilti"]});
  });

  it("counts active filters independently from the search query",()=>{
    expect(activeCatalogFilterCount({query:"pinza",categories:["elevacion"],brands:["WIMAG"],hasDocument:true})).toBe(3);
  });
});
