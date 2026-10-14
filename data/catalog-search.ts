import type {PublicCatalogProduct} from "./public-catalog";
import {catalogApplications,catalogCategories,catalogSynonyms,isCatalogCategory,type CatalogApplicationId,type CatalogCategoryId} from "./catalog-taxonomy";

export type CatalogCommercialMode="purchase"|"quote";
export type CatalogSearchState={
  query:string;
  categories?:CatalogCategoryId[];
  subcategories?:string[];
  applications?:CatalogApplicationId[];
  pieceTypes?:string[];
  materials?:string[];
  brands?:string[];
  hasDocument?:boolean;
  commercialMode?:CatalogCommercialMode;
  assisted?:boolean;
};
export type CatalogSuggestion={type:"product"|"category"|"application"|"brand"|"assisted";id:string;label:string;detail:string};
export type CatalogFacetOption={value:string;label:string;count:number;disabled:boolean};
export type CatalogFacets={categories:CatalogFacetOption[];subcategories:CatalogFacetOption[];applications:CatalogFacetOption[];pieceTypes:CatalogFacetOption[];materials:CatalogFacetOption[];brands:CatalogFacetOption[]};

export function normalizeCatalogText(value:string){
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().split(/\s+/).filter(Boolean).map(token=>token.length>4?token.replace(/(?:es|s)$/i,""):token).join(" ");
}

const synonymGroups=Object.values(catalogSynonyms).map(group=>group.map(normalizeCatalogText));
function aliases(term:string){return synonymGroups.find(group=>group.includes(term))??[term];}
const includesAlias=(text:string,term:string)=>aliases(term).some(alias=>text.includes(alias));
const categoryLabel=(id?:CatalogCategoryId)=>catalogCategories.find(category=>category.id===id)?.label??"";
const applicationLabels=(ids:CatalogApplicationId[])=>ids.map(id=>catalogApplications.find(application=>application.id===id)?.label??id).join(" ");

export type CatalogSearchDocument={reference:string;name:string;applications:string;pieceTypes:string;category:string;brand:string;rest:string};
export function buildSearchDocument(product:PublicCatalogProduct):CatalogSearchDocument{
  return {
    reference:normalizeCatalogText(`${product.reference} ${product.sku}`),
    name:normalizeCatalogText(product.name),
    applications:normalizeCatalogText(applicationLabels(product.applications)),
    pieceTypes:normalizeCatalogText(product.pieceTypes.join(" ")),
    category:normalizeCatalogText(`${product.category??""} ${categoryLabel(product.category)} ${product.subcategory??""}`),
    brand:normalizeCatalogText(product.brand),
    rest:normalizeCatalogText(`${product.family} ${product.materials.join(" ")} ${product.description} ${product.specifications.join(" ")} ${product.certifications.join(" ")}`),
  };
}

function scoreProduct(product:PublicCatalogProduct,query:string){
  const normalized=normalizeCatalogText(query);
  if(!normalized)return 1;
  const terms=normalized.split(" ");
  const document=buildSearchDocument(product);
  let score=0;
  const intentCategory:CatalogCategoryId|undefined=
    terms.some(term=>catalogSynonyms.elevar.map(normalizeCatalogText).includes(term))?"elevacion":
    terms.some(term=>catalogSynonyms.perforar.map(normalizeCatalogText).includes(term))?"corte":
    terms.some(term=>catalogSynonyms.fijar.map(normalizeCatalogText).includes(term))?"fijacion":
    terms.some(term=>catalogSynonyms.altura.map(normalizeCatalogText).includes(term))?"altura":undefined;
  if(intentCategory&&product.category===intentCategory)score+=200;
  if(document.reference===normalized)score+=1000;
  for(const term of terms){
    if(includesAlias(document.reference,term))score+=100;
    if(includesAlias(document.name,term))score+=40;
    if(includesAlias(document.applications,term))score+=30;
    if(includesAlias(document.pieceTypes,term))score+=25;
    if(includesAlias(document.category,term))score+=20;
    if(includesAlias(document.brand,term))score+=10;
    if(includesAlias(document.rest,term))score+=4;
  }
  return score;
}

const selected=(values:string[]|undefined,value:string|undefined)=>!values?.length||Boolean(value&&values.includes(value));
export function searchCatalog(products:PublicCatalogProduct[],state:CatalogSearchState){
  return products.map((product,index)=>({product,index,score:scoreProduct(product,state.query)})).filter(({product,score})=>
    score>0&&selected(state.categories,product.category)&&selected(state.subcategories,product.subcategory)&&
    (!state.applications?.length||state.applications.some(value=>product.applications.includes(value)))&&
    (!state.pieceTypes?.length||state.pieceTypes.some(value=>product.pieceTypes.includes(value)))&&
    (!state.materials?.length||state.materials.some(value=>product.materials.includes(value)))&&
    selected(state.brands,product.brand)&&
    (state.hasDocument===undefined||Boolean(product.technicalDocument)===state.hasDocument)&&
    (!state.commercialMode||(state.commercialMode==="purchase"?product.purchasable:!product.purchasable))
  ).sort((a,b)=>(b.score-a.score)||(a.index-b.index)).map(entry=>entry.product);
}

export function suggestCatalog(products:PublicCatalogProduct[],query:string,limit=8):CatalogSuggestion[]{
  const normalized=normalizeCatalogText(query);
  const results=searchCatalog(products,{query}).slice(0,limit);
  const categories=[...new Set(results.map(product=>product.category).filter((value):value is CatalogCategoryId=>Boolean(value)))].map(id=>({type:"category" as const,id,label:categoryLabel(id),detail:"Categoría"}));
  const applications=[...new Set(results.flatMap(product=>product.applications))].slice(0,2).map(id=>({type:"application" as const,id,label:catalogApplications.find(application=>application.id===id)?.label??id,detail:"Aplicación"}));
  const productItems=results.map(product=>({type:"product" as const,id:product.id,label:product.name,detail:`${product.brand} · ${product.reference}`}));
  const brands=[...new Set(results.map(product=>product.brand))].slice(0,1).map(brand=>({type:"brand" as const,id:brand,label:brand,detail:"Marca"}));
  const assisted:CatalogSuggestion={type:"assisted",id:"assisted",label:"Ayúdame a elegir",detail:normalized?`Buscar una solución para «${query.trim()}»`:"Selector técnico"};
  const candidates:CatalogSuggestion[]=[...categories,...applications,...productItems,...brands];
  return [...candidates.slice(0,Math.max(0,limit-1)),assisted].slice(0,limit);
}

function facetOptions(universe:string[],results:string[]):CatalogFacetOption[]{
  return [...new Set(universe.filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es")).map(value=>{const count=results.filter(result=>result===value).length;return {value,label:value,count,disabled:count===0};});
}
export function buildFacets(products:PublicCatalogProduct[],state:CatalogSearchState):CatalogFacets{
  const results=searchCatalog(products,state);
  return {
    categories:catalogCategories.map(category=>{const count=results.filter(product=>product.category===category.id).length;return {value:category.id,label:category.label,count,disabled:count===0};}),
    subcategories:facetOptions(products.map(product=>product.subcategory??""),results.map(product=>product.subcategory??"")),
    applications:catalogApplications.map(application=>{const count=results.filter(product=>product.applications.includes(application.id)).length;return {value:application.id,label:application.label,count,disabled:count===0};}),
    pieceTypes:facetOptions(products.flatMap(product=>product.pieceTypes),results.flatMap(product=>product.pieceTypes)),
    materials:facetOptions(products.flatMap(product=>product.materials),results.flatMap(product=>product.materials)),
    brands:facetOptions(products.map(product=>product.brand),results.map(product=>product.brand)),
  };
}

const applicationIds=new Set<string>(catalogApplications.map(application=>application.id));
const splitValues=(params:URLSearchParams,key:string)=>params.getAll(key).flatMap(value=>value.split(",")).map(value=>value.trim()).filter(value=>value.length>0&&value.length<=80);
export function parseCatalogState(input:URLSearchParams|string):CatalogSearchState{
  const params=typeof input==="string"?new URLSearchParams(input):input;
  const state:CatalogSearchState={query:(params.get("q")??"").trim().slice(0,120)};
  const categories=splitValues(params,"category").filter(isCatalogCategory);if(categories.length)state.categories=categories;
  const applications=splitValues(params,"application").filter((value):value is CatalogApplicationId=>applicationIds.has(value));if(applications.length)state.applications=applications;
  for(const [key,field] of [["subcategory","subcategories"],["piece","pieceTypes"],["material","materials"],["brand","brands"]] as const){const values=splitValues(params,key);if(values.length)state[field]=values;}
  if(params.get("document")==="yes")state.hasDocument=true;else if(params.get("document")==="no")state.hasDocument=false;
  if(params.get("mode")==="purchase"||params.get("mode")==="quote")state.commercialMode=params.get("mode") as CatalogCommercialMode;
  if(params.get("ayuda")==="1")state.assisted=true;
  return state;
}

export function serializeCatalogState(state:CatalogSearchState){
  const params=new URLSearchParams();
  if(state.query.trim())params.set("q",state.query.trim());
  for(const [key,values] of [["category",state.categories],["subcategory",state.subcategories],["application",state.applications],["piece",state.pieceTypes],["material",state.materials],["brand",state.brands]] as const)for(const value of values??[])params.append(key,value);
  if(state.hasDocument!==undefined)params.set("document",state.hasDocument?"yes":"no");
  if(state.commercialMode)params.set("mode",state.commercialMode);
  if(state.assisted)params.set("ayuda","1");
  return params;
}
