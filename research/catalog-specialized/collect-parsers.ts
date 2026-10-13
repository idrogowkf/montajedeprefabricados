export type SourceCandidate={manufacturer:string;reference:string;originalName:string;nameEs:string;descriptionEs:string;capacityEs:string;imageUrl:string;imageUrls:string[];pdfUrl:string;productUrl:string;manufacturingCountry:"España"|"Alemania"};
const clean=(value:string)=>value.replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
const meta=(html:string,key:string)=>clean(html.match(new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)`,`i`))?.[1]??"");
const title=(html:string)=>clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]??meta(html,"og:title"));
const absolute=(value:string,base:string)=>value?new URL(value,base).href:"";
const pdf=(html:string,base:string)=>{const values=[...html.matchAll(/href=["']([^"']+(?:\.pdf|\.PDF)(?:\?[^"']*)?)/g)].map(m=>m[1]);return absolute(values.find(v=>/(?:ppes|es|manual|prospecto|ficha)/i.test(v))??values[0]??"",base);};

export function parseElebiaProduct(productUrl:string,html:string):SourceCandidate{
 const name=meta(html,"og:title")||title(html);const reference=(name.match(/(?:NEO|EVO|C|S|D|R)\s*\d+(?:[A-Z])?/i)?.[0]??new URL(productUrl).pathname.split("/").filter(Boolean).at(-1)??"").replace(/\s+/g,"").toUpperCase();
 const tonnes=html.match(/(?:capacidad[^<]{0,40}?|elevaci[oó]n[^<]{0,40}?)(\d{1,3}(?:[.,]\d+)?)\s*(?:toneladas|tonnes|t\b)/i)?.[1]??name.match(/(?:NEO|EVO)\s*(\d{1,3})/i)?.[1]??"";
 const imageUrl=absolute(meta(html,"og:image"),productUrl);return {manufacturer:"Elebia",reference,originalName:name,nameEs:name,descriptionEs:meta(html,"og:description"),capacityEs:tonnes?`${tonnes} toneladas`:"Según configuración",imageUrl,imageUrls:[imageUrl],pdfUrl:pdf(html,productUrl),productUrl,manufacturingCountry:"España"};
}

export function parsePfeiferVariants(productUrl:string,html:string):SourceCandidate[]{
 const name=title(html),imageUrl=absolute(meta(html,"og:image"),productUrl),pdfUrl=pdf(html,productUrl);const description=clean(html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]??name);
 const matches=[...html.matchAll(/N[uú]mero de pedido\s*(?:<[^>]+>|\||\s)*([0-9]{5,8})[\s\S]{0,180}?WLL[^|<\d]{0,20}(?:<[^>]+>|\||\s)*([0-9]+(?:[.,][0-9]+)?)/gi)];
 return matches.map(match=>({manufacturer:"PFEIFER",reference:match[1],originalName:name,nameEs:`${name} ${match[1]}`,descriptionEs:description,capacityEs:`${match[2].replace(".",",")} kN`,imageUrl,imageUrls:[imageUrl],pdfUrl,productUrl,manufacturingCountry:"Alemania"}));
}

export function parseProbstVariants(productUrl:string,html:string):SourceCandidate[]{
 const base=title(html),imageUrl=absolute(meta(html,"og:image"),productUrl),pdfUrl=pdf(html,productUrl);const rows=[...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(row=>[...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(cell=>clean(cell[1])));
 return rows.flatMap(cells=>{const reference=cells.find(value=>/^\d{8}$/.test(value));const model=cells.find(value=>/[A-Z]{2,}[-A-Z0-9]+/.test(value));const load=cells.find(value=>/^\d[\d.,]*\s*(?:kg|t)$/i.test(value));if(!reference||!model)return[];const capacity=load?load.replace(/^(\d{4,})\s*kg$/i,(_,digits)=>`${String(digits).replace(/\B(?=(\d{3})+(?!\d))/g,".")} kg`):"Según configuración";return [{manufacturer:"Probst",reference,originalName:`${base} ${model}`,nameEs:`${base} ${model}`,descriptionEs:`Equipo profesional ${model} para la manipulación segura de elementos prefabricados de hormigón.`,capacityEs:capacity,imageUrl,imageUrls:[imageUrl],pdfUrl,productUrl,manufacturingCountry:"Alemania"}];});
}

const wimagNames:Record<string,string>={
 "pipe-suspension-grab":"Pinza suspendida para tubos","manhole-clamp":"Pinza para pozos","pipe-laying-hook":"Gancho para colocación de tubos","round-clamp":"Pinza para elementos redondos","manhole-housing-grab":"Pinza para cuerpos de pozo","pipe-chain-sling":"Eslinga de cadena para tubos","hydro-grab":"Pinza hidráulica","clamp-for-upright-slabs":"Pinza para placas verticales","turbo-m-levator":"Elevador por vacío Turbo M","turbo-h-levator":"Elevador por vacío Turbo H","flat-grab":"Pinza plana","lifting-beam":"Balancín de elevación",
};
export function parseWimagProduct(productUrl:string,html:string):SourceCandidate{
 const slug=new URL(productUrl).pathname.split("/").filter(Boolean).at(-1)?.replace(/\.html$/i,"")??"producto";const heading=clean(html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i)?.[1]??"");
 const reference=heading.match(/\b(\d{2,4}(?:\s\d{3})?)\s*\|/)?.[1]?.replace(/\s+/g,"-")??html.match(/\/([0-9]{2,4})[-_][^"']+\.(?:pdf|jpg|png)/i)?.[1]??slug.toUpperCase();
 const base=wimagNames[slug]??`Equipo de manipulación ${slug.replaceAll("-"," ")}`;const gallery=[...html.matchAll(/<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|webp))["'][^>]+data-fancybox=["']gallery[^"']*["']/gi)].map(match=>absolute(match[1],productUrl));const fallback=[...html.matchAll(/(?:src|href)=["']([^"']*(?:user_upload|_processed_)[^"']*\.(?:jpg|jpeg|png|webp))["']/gi)].map(match=>absolute(match[1],productUrl)).filter(value=>!/(?:youtube|placeholder|logo|appicon|qr[-_]?code|datasheet)/i.test(value));const imageUrls=[...new Set((gallery.length?gallery:fallback).filter(Boolean))].slice(0,7);const image=imageUrls.find(value=>value.toLowerCase().includes(reference.toLowerCase().split("-")[0]))??imageUrls[0]??"";
 return {manufacturer:"WIMAG",reference,originalName:heading||slug,nameEs:`${base} WIMAG ${reference}`,descriptionEs:`Equipo WIMAG para la manipulación y elevación segura de elementos prefabricados de hormigón.`,capacityEs:"Según configuración",imageUrl:image,imageUrls,pdfUrl:pdf(html,productUrl),productUrl,manufacturingCountry:"Alemania"};
}
