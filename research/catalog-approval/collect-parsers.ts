type ParsedProduct={manufacturer:string;reference:string;name:string;description:string;imageUrl:string;pdfUrl:string};

const entities=(value:string)=>value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
const meta=(html:string,property:string)=>entities(html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,`i`))?.[1]??html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,`i`))?.[1]??"");
const absolute=(url:string,base:string)=>new URL(entities(url),base).href;

export function parseRothoblaasProduct(productUrl:string,html:string):ParsedProduct{
 const pdfs=[...html.matchAll(/(?:href|src)=["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi)].map(match=>match[1]);
 const pdf=pdfs.find(value=>/technical-data-sheet.*(?:en|english)/i.test(value))??pdfs.find(value=>/technical-data-sheet/i.test(value))??pdfs[0]??"";
 return {manufacturer:"Rothoblaas",reference:new URL(productUrl).pathname.split("/").filter(Boolean).at(-1)?.toUpperCase()??"",name:meta(html,"og:title"),description:meta(html,"og:description"),imageUrl:absolute(meta(html,"og:image"),productUrl),pdfUrl:absolute(pdf,productUrl)};
}

export function parseHiltiProduct(productUrl:string,html:string):ParsedProduct{
 const image=html.match(/https:\/\/productdata\.hilti\.com\/APQ_HC_f2000\/[A-Za-z0-9_.-]+/i)?.[0]??meta(html,"og:image");
 const pdf=html.match(/https:\/\/productdata\.hilti\.com\/APQ_HC_RAW\/[A-Za-z0-9_.-]+\.pdf(?:\?[^"'<> ]*)?/i)?.[0]??"";
 return {manufacturer:"Hilti",reference:new URL(productUrl).pathname.split("/").filter(Boolean).at(-1)?.toUpperCase()??"",name:meta(html,"og:title"),description:meta(html,"og:description"),imageUrl:entities(image),pdfUrl:entities(pdf)};
}

export function parseRothenbergerProduct(productUrl:string,html:string,pageData:string):ParsedProduct{
 const urls=[...pageData.matchAll(/https?:\\?\/\\?\/[^"\\]+/g)].map(match=>match[0].replaceAll("\\/","/"));
 const pdf=urls.find(value=>/(?:\.pdf(?:\?|$)|downloadname=[^&" ]+\.pdf)/i.test(value))??"";
 const tail=new URL(productUrl).pathname.split("/").filter(Boolean).at(-1)??"";
 return {manufacturer:"Rothenberger",reference:tail.match(/(\d+)$/)?.[1]??tail.toUpperCase(),name:meta(html,"og:title"),description:meta(html,"og:description"),imageUrl:absolute(meta(html,"og:image"),productUrl),pdfUrl:entities(pdf)};
}
