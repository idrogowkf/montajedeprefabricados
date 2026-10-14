"use client";

import {useState} from "react";
import type {CatalogFacets,CatalogSearchState} from "@/data/catalog-search";

export type CatalogFacetArrayKey="categories"|"subcategories"|"applications"|"pieceTypes"|"materials"|"brands";

export function toggleCatalogFacet(state:CatalogSearchState,key:CatalogFacetArrayKey,value:string):CatalogSearchState{
  const current=[...(state[key]??[])] as string[];
  const values=current.includes(value)?current.filter(item=>item!==value):[...current,value];
  const next={...state};
  if(values.length)(next as Record<string,unknown>)[key]=values;else delete (next as Record<string,unknown>)[key];
  return next;
}

export function clearCatalogFacet(state:CatalogSearchState,key:CatalogFacetArrayKey|"hasDocument"|"commercialMode"):CatalogSearchState{
  const next={...state};delete (next as Record<string,unknown>)[key];return next;
}

export function activeCatalogFilterCount(state:CatalogSearchState){
  return (["categories","subcategories","applications","pieceTypes","materials","brands"] as CatalogFacetArrayKey[]).reduce((total,key)=>total+(state[key]?.length??0),0)+(state.hasDocument===undefined?0:1)+(state.commercialMode?1:0);
}

export function CatalogFilters({facets,state,onChange,onClear}:{facets:CatalogFacets;state:CatalogSearchState;onChange:(state:CatalogSearchState)=>void;onClear:()=>void}){
  const [mobileOpen,setMobileOpen]=useState(false);
  const count=activeCatalogFilterCount(state);
  const groups:[CatalogFacetArrayKey,string,CatalogFacets[keyof CatalogFacets]][]=[
    ["categories","Categoría",facets.categories],
    ["applications","Aplicación",facets.applications],
    ["materials","Material",facets.materials],
    ["brands","Marca",facets.brands],
  ];
  return <>
    <button className="mobile-filter-trigger" type="button" onClick={()=>setMobileOpen(true)}>Filtros ({count})</button>
    <aside className={`filters catalog-filters${mobileOpen?" open":""}`} aria-label="Filtrar catálogo">
      <header><strong>Filtrar resultados</strong>{mobileOpen&&<button type="button" aria-label="Cerrar filtros" onClick={()=>setMobileOpen(false)}>×</button>}</header>
      {count>0&&<div className="active-filters" aria-label="Filtros activos">
        {groups.flatMap(([key,,options])=>(state[key]??[]).map(value=><button type="button" key={`${key}-${value}`} onClick={()=>onChange(toggleCatalogFacet(state,key,value))}>{options.find(option=>option.value===value)?.label??value} ×</button>))}
        {state.hasDocument!==undefined&&<button type="button" onClick={()=>onChange(clearCatalogFacet(state,"hasDocument"))}>Con ficha PDF ×</button>}
        {state.commercialMode&&<button type="button" onClick={()=>onChange(clearCatalogFacet(state,"commercialMode"))}>{state.commercialMode==="purchase"?"Compra directa":"Solicitar oferta"} ×</button>}
      </div>}
      {groups.map(([key,label,options])=><fieldset key={key}><legend>{label}</legend>{options.map(option=>{const checked=(state[key]??[]).includes(option.value as never);return <label key={option.value}><input type="checkbox" checked={checked} disabled={option.disabled&&!checked} onChange={()=>onChange(toggleCatalogFacet(state,key,option.value))}/><span>{option.label}</span><small>{option.count}</small></label>;})}</fieldset>)}
      <fieldset><legend>Documentación</legend><label><input type="checkbox" checked={state.hasDocument===true} onChange={()=>onChange(state.hasDocument===true?clearCatalogFacet(state,"hasDocument"):{...state,hasDocument:true})}/><span>Ficha técnica PDF</span></label></fieldset>
      <fieldset><legend>Modalidad</legend><label><input type="radio" name="commercial-mode" checked={state.commercialMode==="purchase"} onChange={()=>onChange({...state,commercialMode:"purchase"})}/><span>Compra directa</span></label><label><input type="radio" name="commercial-mode" checked={state.commercialMode==="quote"} onChange={()=>onChange({...state,commercialMode:"quote"})}/><span>Solicitar oferta</span></label></fieldset>
      <button className="clear-filters" type="button" onClick={onClear} disabled={!count}>Limpiar todos</button>
    </aside>
  </>;
}
