import {catalogExpansionSeeds,type CatalogExpansionSeed} from "./catalog-expansion";
import type {CatalogProduct,CatalogSegment} from "./catalog";
import type {CatalogApplicationId,CatalogCategoryId} from "./catalog-taxonomy";

export type CatalogRecoveryIssue=
  |"missing-reference"|"missing-source"|"missing-image"|"forbidden-image"
  |"editorial-content"|"non-pdf-datasheet"|"brand-category";

const brandCategoryNames=new Set(["hilti","petzl","kratos","3m","wimag","elebia","pfeifer"]);
const forbiddenImage=/(?:person|people|portrait|employee|staff|equipo-humano|qr(?:code)?|logo|logotipo|datasheet|ficha[-_ ]?tecnica)/i;
const editorialText=/(?:noticias?|novedades|art[ií]culo editorial|blog|emplead[oa]s?)/i;

export function auditRecoveredProduct(product:CatalogProduct):CatalogRecoveryIssue[]{
  const issues:CatalogRecoveryIssue[]=[];
  if(!product.supplier.reference.trim()||product.supplier.reference==="PENDIENTE")issues.push("missing-reference");
  if(!/^https:\/\//.test(product.sourceUrl))issues.push("missing-source");
  const images=[...(product.imageUrls??[]),...(product.imageUrl?[product.imageUrl]:[])];
  if(images.length===0)issues.push("missing-image");
  if(images.some(url=>forbiddenImage.test(url)))issues.push("forbidden-image");
  if(editorialText.test(`${product.name} ${product.publicDescription??""}`))issues.push("editorial-content");
  if(product.datasheetUrl&&!/\.pdf(?:$|[?#])/i.test(product.datasheetUrl))issues.push("non-pdf-datasheet");
  if(product.category&&brandCategoryNames.has(product.category))issues.push("brand-category");
  return [...new Set(issues)];
}

function realReference(seed:CatalogExpansionSeed){
  if(seed.brand==="Petzl"&&/^EPI-\d+$/.test(seed.reference)){
    return seed.imageUrl.match(/\/product\/([A-Z]\d+[A-Z0-9-]*)/)?.[1]??seed.sku;
  }
  return seed.reference;
}

function classify(seed:CatalogExpansionSeed):{category:CatalogCategoryId;subcategory:string;applications:CatalogApplicationId[];materials:string[]}{
  if(seed.sku.startsWith("FIX-"))return {category:"fijacion",subcategory:/qu[ií]mic|c[aá]psula|mortero/i.test(seed.name)?"Anclajes químicos":"Anclajes mecánicos",applications:["fijar-hormigon"],materials:["hormigón","acero"]};
  if(seed.sku.startsWith("CUT-"))return {category:"corte",subcategory:/disco/i.test(seed.name)?"Discos":/corona/i.test(seed.name)?"Coronas y brocas":"Perforación",applications:["perforar-hormigon"],materials:["hormigón"]};
  if(seed.id.includes("helmet")||/casco|vertex|strato/i.test(seed.name))return {category:"epi",subcategory:"Cascos",applications:["proteccion-personal"],materials:[]};
  return {category:"altura",subcategory:"Arneses",applications:["trabajar-en-altura"],materials:[]};
}

function adaptSeed(seed:CatalogExpansionSeed):CatalogProduct{
  const classification=classify(seed);
  const reference=realReference(seed);
  const segments=[...new Set(seed.segments)] as CatalogSegment[];
  const commercial={cost:0,inboundShipping:0,handling:0,contingencyPercent:0,targetMarginPercent:28,vatPercent:21,status:"quote" as const,costVerified:false};
  return {
    id:seed.id,sku:seed.sku,name:seed.name,brand:seed.brand,family:seed.family,segments,
    ...classification,unit:"ud.",rotation:"media",certifications:["Documentación técnica según referencia oficial del fabricante"],
    publicDescription:seed.description,publicSpecifications:seed.specifications,
    supplier:{name:seed.brand,country:"UE",reference},sourceUrl:seed.sourceUrl,
    imageUrl:seed.imageUrl,imageUrls:[seed.imageUrl],imageSource:`Catálogo oficial ${seed.brand}`,
    imageVerification:seed.imageVerification,offers:[],commercial,price:0,priceVat:0,profit:0,
    accent:"#ef233c",initials:seed.brand.slice(0,2).toUpperCase(),availability:"Disponible bajo oferta técnica",
    delivery:"Plazo según referencia y destino",badge:"Oferta técnica",rating:4.6,reviews:0,
  };
}

const selectedSeeds=[
  ...catalogExpansionSeeds.filter(seed=>seed.brand==="Hilti"&&seed.sku.startsWith("FIX-")).slice(0,60),
  ...catalogExpansionSeeds.filter(seed=>seed.brand==="Hilti"&&seed.sku.startsWith("CUT-")).slice(0,20),
  ...catalogExpansionSeeds.filter(seed=>seed.brand==="Petzl").slice(0,17),
];

export const recoveredCatalogProducts:CatalogProduct[]=selectedSeeds.map(adaptSeed).filter(product=>auditRecoveredProduct(product).length===0);
