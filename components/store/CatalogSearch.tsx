"use client";

import {useEffect,useId,useMemo,useRef,useState} from "react";
import {suggestCatalog,type CatalogSuggestion} from "@/data/catalog-search";
import type {PublicCatalogProduct} from "@/data/public-catalog";

export type CatalogSearchAction=
  |{kind:"product"|"category"|"application"|"brand";value:string}
  |{kind:"assisted"};

export function resolveCatalogSearchAction(suggestion:CatalogSuggestion):CatalogSearchAction{
  return suggestion.type==="assisted"?{kind:"assisted"}:{kind:suggestion.type,value:suggestion.id};
}

export function nextCatalogSearchIndex(current:number,key:string,length:number){
  if(!length||key==="Escape")return -1;
  if(key==="ArrowDown")return current>=length-1?0:current+1;
  if(key==="ArrowUp")return current<=0?length-1:current-1;
  return current;
}

export function CatalogSearch({products,query,onQueryChange,onNavigate,onAssistedSearch}:{
  products:PublicCatalogProduct[];
  query:string;
  onQueryChange:(value:string)=>void;
  onNavigate:(action:Exclude<CatalogSearchAction,{kind:"assisted"}>)=>void;
  onAssistedSearch:()=>void;
}){
  const root=useRef<HTMLDivElement>(null);
  const listId=useId();
  const [open,setOpen]=useState(Boolean(query.trim()));
  const [activeIndex,setActiveIndex]=useState(-1);
  const suggestions=useMemo(()=>query.trim()?suggestCatalog(products,query,8):[],[products,query]);
  const select=(suggestion:CatalogSuggestion)=>{
    const action=resolveCatalogSearchAction(suggestion);
    setOpen(false);setActiveIndex(-1);
    if(action.kind==="assisted")onAssistedSearch();else onNavigate(action);
  };
  useEffect(()=>{const close=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node)){setOpen(false);setActiveIndex(-1);}};document.addEventListener("pointerdown",close);return()=>document.removeEventListener("pointerdown",close);},[]);
  useEffect(()=>{if(!query.trim())setOpen(false);},[query]);
  return <div className="catalog-search" ref={root}>
    <label className="sr-only" htmlFor="store-search">Buscar productos</label>
    <div className="catalog-search-control">
      <input id="store-search" role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={open&&suggestions.length>0} aria-activedescendant={activeIndex>=0?`${listId}-${activeIndex}`:undefined} value={query} onFocus={()=>query.trim()&&setOpen(true)} onChange={event=>{onQueryChange(event.target.value);setOpen(Boolean(event.target.value.trim()));setActiveIndex(-1);}} onKeyDown={event=>{
        if(["ArrowDown","ArrowUp","Escape"].includes(event.key)){event.preventDefault();const next=nextCatalogSearchIndex(activeIndex,event.key,suggestions.length);setActiveIndex(next);if(event.key==="Escape")setOpen(false);else setOpen(true);}
        if(event.key==="Enter"&&open&&activeIndex>=0){event.preventDefault();select(suggestions[activeIndex]);}
      }} placeholder="¿Qué necesitas montar, elevar, fijar o perforar?"/>
      <button type="button" aria-label="Buscar" onClick={()=>setOpen(Boolean(query.trim()))}>⌕</button>
    </div>
    {open&&suggestions.length>0&&<div className="catalog-suggestions" id={listId} role="listbox" aria-label="Sugerencias de búsqueda">
      {suggestions.map((suggestion,index)=><button type="button" role="option" aria-selected={index===activeIndex} id={`${listId}-${index}`} key={`${suggestion.type}-${suggestion.id}`} className={index===activeIndex?"active":""} onMouseEnter={()=>setActiveIndex(index)} onClick={()=>select(suggestion)}><span>{suggestion.label}</span><small>{suggestion.detail}</small></button>)}
    </div>}
  </div>;
}
