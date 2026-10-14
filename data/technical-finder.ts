import type {CatalogCategoryId} from "./catalog-taxonomy";
import {searchCatalog} from "./catalog-search";
import type {PublicCatalogProduct} from "./public-catalog";

export type TechnicalFinderStep="intent"|"context"|"details"|"results";
export type TechnicalFinderState={
  intent?:CatalogCategoryId;
  piece?:string;
  material?:string;
  dimensions?:string;
  weightKg?:number;
  openingMm?:number;
  conditions?:string;
  delivery?:string;
};
export type TechnicalCandidate={product:PublicCatalogProduct;status:"compatible"|"requires-review";reasons:string[]};

export function nextFinderStep(state:TechnicalFinderState):TechnicalFinderStep{
  if(!state.intent)return "intent";
  if(!state.piece?.trim()||!state.material?.trim())return "context";
  if(state.intent==="elevacion"&&(!state.weightKg||!state.dimensions?.trim()))return "details";
  return "results";
}

export function previousFinderStep(step:TechnicalFinderStep):TechnicalFinderStep{
  return ({intent:"intent",context:"intent",details:"context",results:"details"} as const)[step];
}

const numericAttribute=(product:PublicCatalogProduct,key:string)=>{const value=product.technicalAttributes[key];return typeof value==="number"&&Number.isFinite(value)?value:undefined;};
function evaluateLifting(product:PublicCatalogProduct,state:TechnicalFinderState):TechnicalCandidate{
  const reasons:string[]=[];
  if(!state.weightKg)reasons.push("Falta indicar el peso de la pieza");
  if(!state.dimensions?.trim())reasons.push("Faltan dimensiones o geometría de agarre");
  const capacity=numericAttribute(product,"capacityKg");
  const minimum=numericAttribute(product,"minOpeningMm");
  const maximum=numericAttribute(product,"maxOpeningMm");
  if(capacity===undefined)reasons.push("La capacidad numérica de esta variante requiere confirmación");
  else if(state.weightKg&&state.weightKg>capacity)reasons.push("El peso indicado supera la capacidad documentada");
  if(minimum===undefined||maximum===undefined)reasons.push("La apertura admisible requiere confirmación del fabricante");
  else if(state.openingMm===undefined)reasons.push("Falta una medida de apertura comprobable");
  else if(state.openingMm<minimum||state.openingMm>maximum)reasons.push("La apertura indicada queda fuera del intervalo documentado");
  const piece=state.piece?.toLowerCase();
  if(piece&&product.pieceTypes.length&&!product.pieceTypes.some(value=>value.toLowerCase().includes(piece)||piece.includes(value.toLowerCase())))reasons.push("La geometría de pieza debe validarse con la ficha del fabricante");
  return {product,status:reasons.length?"requires-review":"compatible",reasons};
}

export function findTechnicalCandidates(products:PublicCatalogProduct[],state:TechnicalFinderState):TechnicalCandidate[]{
  if(!state.intent)return [];
  const categoryProducts=products.filter(product=>product.category===state.intent);
  const ranked=searchCatalog(categoryProducts,{query:[state.piece,state.material].filter(Boolean).join(" "),categories:[state.intent]});
  const candidates=(ranked.length?ranked:categoryProducts).slice(0,12);
  return candidates.map(product=>{
    if(state.intent==="elevacion")return evaluateLifting(product,state);
    const reasons:string[]=[];
    if(!product.reference.trim())reasons.push("Falta referencia verificable");
    if(!product.imageUrl)reasons.push("Falta imagen oficial");
    if(!product.technicalDocument)reasons.push("La documentación técnica requiere revisión");
    return {product,status:reasons.length?"requires-review":"compatible",reasons};
  });
}

export function formatTechnicalRequest(state:TechnicalFinderState){
  return [
    "Solicitud desde el selector técnico:",
    `Trabajo: ${state.intent??"Sin indicar"}`,
    `Pieza o soporte: ${state.piece??"Sin indicar"}`,
    `Material: ${state.material??"Sin indicar"}`,
    `Dimensiones: ${state.dimensions??"Sin indicar"}`,
    `Peso o carga: ${state.weightKg?`${state.weightKg} kg`:"Sin indicar"}`,
    `Condiciones de uso: ${state.conditions??"Sin indicar"}`,
    `Código postal / entrega: ${state.delivery??"Sin indicar"}`,
  ].join("\n");
}
