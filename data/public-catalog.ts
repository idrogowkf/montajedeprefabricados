import type {CatalogSegment} from "./catalog";

export type PublicCatalogProduct={
  id:string;sku:string;name:string;brand:string;family:string;segments:CatalogSegment[];unit:string;
  certifications:string[];imageUrl?:string;imageUrls?:string[];
  technicalDocument?:{url:string;label:string};canRequestTechnicalDocument:boolean;
  description:string;specifications:string[];
  price:number;priceVat:number;vatPercent:number;purchasable:boolean;
  accent:string;initials:string;availability:string;delivery:string;rating:number;reviews:number;
};

const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function filterPublicCatalog(products:PublicCatalogProduct[],query:string,family:string,material:string){
  const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
  return products.filter(product=>(family==="todos"||product.segments.includes(family as CatalogSegment))&&(material==="todos"||product.segments.includes(material as CatalogSegment))&&terms.every(term=>normalize(`${product.name} ${product.brand} ${product.family} ${product.segments.join(" ")}`).includes(term)));
}
