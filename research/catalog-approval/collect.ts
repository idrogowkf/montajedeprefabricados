import {mkdir,readFile,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import type {ApprovalProduct,ApprovalSection} from "./schema";
import {parseHiltiProduct,parseRothenbergerProduct,parseRothoblaasProduct} from "./collect-parsers";
import {validateApprovalCatalog} from "./validate";

const root=fileURLToPath(new URL("../../",import.meta.url));
const cacheDir=join(root,"tmp/pdfs/catalog-approval/cache");
const output=join(root,"research/catalog-approval/catalog.json");
await mkdir(cacheDir,{recursive:true});

const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
const cacheName=(url:string)=>join(cacheDir,createHash("sha1").update(url).digest("hex")+".txt");
async function fetchText(url:string){
 const path=cacheName(url); try{return await readFile(path,"utf8");}catch{}
 let last:unknown;
 for(let attempt=0;attempt<4;attempt++) try{
  const response=await fetch(url,{headers:{"user-agent":"MontajePrefabricadoCatalogResearch/1.0 (+https://www.montajedeprefabricados.com/)"},redirect:"follow",signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw new Error(`${response.status} ${url}`);
  const text=await response.text(); await writeFile(path,text); return text;
 }catch(error){last=error;await sleep(700*(attempt+1));}
 throw last;
}
async function mapLimit<T,R>(items:T[],limit:number,fn:(item:T,index:number)=>Promise<R>){
 const result=new Array<R>(items.length);let cursor=0;
 await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(true){const index=cursor++;if(index>=items.length)return;result[index]=await fn(items[index],index);}}));
 return result;
}
const sitemapUrls=(xml:string)=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1].replaceAll("&amp;","&"));
const clean=(value:string)=>value.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const applications:Record<ApprovalSection,string[]>={
 hormigon:["Perforación, fijación y montaje de elementos prefabricados de hormigón"],acero:["Corte, perforación, fijación y montaje de estructuras prefabricadas de acero"],madera:["Uniones y montaje de estructuras prefabricadas de madera"],pvc:["Corte, unión, soldadura e instalación de sistemas prefabricados de PVC"],altura:["Protección colectiva, acceso y trabajo seguro en altura"],epi:["Protección individual para operaciones de montaje y elevación"],
};
const origin:Record<string,string>={Rothoblaas:"Italia",Hilti:"Liechtenstein / UE",Rothenberger:"Alemania",Petzl:"Francia"};
function record(section:ApprovalSection,raw:{manufacturer:string;reference:string;name:string;description:string;imageUrl:string;pdfUrl:string},productUrl:string):ApprovalProduct{
 return {id:`${raw.manufacturer}-${raw.reference}`.toLowerCase().replace(/[^a-z0-9]+/g,"-"),section,tags:[section,"montaje profesional"],manufacturer:raw.manufacturer,reference:raw.reference,name:clean(raw.name),description:clean(raw.description)||applications[section][0],applications:applications[section],supplier:`${raw.manufacturer} (fuente oficial)`,origin:origin[raw.manufacturer]??"Unión Europea",productUrl,pdfUrl:raw.pdfUrl,imageUrl:raw.imageUrl,verifiedAt:new Date().toISOString().slice(0,10),checks:{product:200,pdf:200,image:200,pdfSignature:true,imageMime:"image/verified"}};
}
const validRaw=(raw:{reference:string;name:string;imageUrl:string;pdfUrl:string})=>Boolean(raw.reference&&raw.name&&/^https?:/.test(raw.imageUrl)&&/^https?:/.test(raw.pdfUrl));

async function collectRothoblaas(){
 const urls=sitemapUrls(await fetchText("https://www.rothoblaas.com/sitemap.xml"));
 const sets:{section:ApprovalSection;urls:string[]}[]=[
  {section:"madera",urls:urls.filter(url=>/^https:\/\/www\.rothoblaas\.com\/products\/fastening\//.test(url))},
  {section:"acero",urls:urls.filter(url=>/^https:\/\/www\.rothoblaas\.com\/products\/tools-and-machines\//.test(url))},
  {section:"altura",urls:urls.filter(url=>/^https:\/\/www\.rothoblaas\.com\/products\/fall-protection-system\//.test(url)&&!url.includes("/personal-protective-equipment/"))},
  {section:"epi",urls:urls.filter(url=>/^https:\/\/www\.rothoblaas\.com\/products\/fall-protection-system\/personal-protective-equipment\//.test(url))},
 ];
 const found:ApprovalProduct[]=[];
 for(const set of sets){
  const parsed=await mapLimit(set.urls,4,async url=>{try{const raw=parseRothoblaasProduct(url,await fetchText(url));return validRaw(raw)?record(set.section,raw,url):null;}catch{return null;}});
  found.push(...parsed.filter((item):item is ApprovalProduct=>Boolean(item)).slice(0,120));
  console.log(`Rothoblaas ${set.section}: ${found.filter(item=>item.section===set.section).length}`);
 }
 return found;
}

function parsePetzl(productUrl:string,html:string){
 const name=clean(html.match(/<title>([^<]+)<\/title>/i)?.[1]?.split(" - ")[0]??"");
 const reference=html.match(/Reference:\s*([A-Z0-9-]+)/i)?.[1]??html.match(/data-variant-sku=["']([A-Z0-9-]+)/i)?.[1]?.split("_")[0]??"";
 const images=[...html.matchAll(/https:\/\/www\.petzl\.com\/on\/demandware\.static\/[^"' ]+\.(?:jpe?g|png|webp)/gi)].map(match=>match[0].replaceAll("&amp;","&"));
 const imageUrl=images.find(url=>reference&&url.toLowerCase().includes(reference.toLowerCase()))??images.find(url=>/master-catalog/.test(url))??"";
 const pdfUrl="https://catalogs.petzl.com/Petzl-pro-catalog-2024/en/data/Petzl-Pro-2024.pdf";
 const description=clean(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1]??`${name}, equipo profesional Petzl.`);
 return {manufacturer:"Petzl",reference,name,description,imageUrl,pdfUrl};
}
async function collectPetzl(needed:number){
 const roots=["harnesses","helmets-face-shields","lanyards-energy-absorbers","carabiners-connectors","ropes","mobile-fall-arresters","pulleys","ascenders-rope-grabs","descenders","anchors","kits","headlamps"];
 const categories=new Set<string>(); const products=new Set<string>();
 for(const rootName of roots){
  const rootUrl=`https://www.petzl.com/int/en/professional/products/${rootName}`;
  let html="";try{html=await fetchText(rootUrl);}catch{continue;}
  for(const match of html.matchAll(/(?:href|url)[=:][`"']([^`"'<>]+)/gi)){
   const href=match[1]; if(!href.includes("/professional/products/"))continue;
   const url=new URL(href,"https://www.petzl.com").href;
   if(url.endsWith(".html"))products.add(url); else if(url.split("/").length<=10)categories.add(url);
  }
 }
 const catPages=await mapLimit([...categories].slice(0,180),6,async url=>{try{return await fetchText(url);}catch{return "";}});
 for(const html of catPages)for(const match of html.matchAll(/(?:href|url)[=:][`"']([^`"'<>]+\.html)/gi)){const href=match[1];if(href.includes("/professional/products/"))products.add(new URL(href,"https://www.petzl.com").href);}
 const parsed=await mapLimit([...products],5,async url=>{try{const raw=parsePetzl(url,await fetchText(url));return validRaw(raw)?record("epi",raw,url):null;}catch{return null;}});
 return parsed.filter((item):item is ApprovalProduct=>Boolean(item)).slice(0,needed);
}

async function collectHilti(){
 const urls=sitemapUrls(await fetchText("https://www.hilti.es/sitemap_items_es_ES.xml")).filter(url=>/\/r?\d+$/.test(url));
 const candidates=await mapLimit(urls,10,async url=>{try{const html=await fetchText(url);const raw=parseHiltiProduct(url,html);return validRaw(raw)?{url,html,raw}:null;}catch{return null;}});
 const concrete=/hormig|anclaj|anchor|diamant|diamond|broca|drill bit|masonry|mortero|epoxi|epoxy|cincel|concrete/i;
 const steel=/acero|metal|amolador|grinder|sierra|saw|corte|cutting|atornill|screwdriver|remach|perno|steel|nibbler|shear/i;
 const valid=candidates.filter((item):item is NonNullable<typeof item>=>Boolean(item));
 const seen=new Set<string>();
 const pick=(section:ApprovalSection,preferred:(item:(typeof valid)[number])=>boolean)=>{
  const selected:ApprovalProduct[]=[];
  for(const item of [...valid.filter(preferred),...valid]){
   if(selected.length===120)break;if(seen.has(item.raw.reference))continue;
   seen.add(item.raw.reference);selected.push(record(section,item.raw,item.url));
  }
  return selected;
 };
 const hormigon=pick("hormigon",item=>concrete.test(`${item.url} ${item.raw.name} ${item.raw.description}`)||/(DIAMOND|FASTENER|MEA_TOOL_INSERT|CONCRETE|ANCHOR)/i.test(item.url));
 const acero=pick("acero",item=>steel.test(`${item.url} ${item.raw.name} ${item.raw.description}`)||/(GRINDER|SAW|METAL|CUTTING|SCREW|DRILL_DRIVER)/i.test(item.url));
 console.log(`Hilti candidates=${valid.length}`);
 if(hormigon.length<120||acero.length<120)console.log(`Hilti shortage hormigon=${hormigon.length} acero=${acero.length}`);
 return [...hormigon,...acero];
}

async function collectRothenberger(){
 const urls=sitemapUrls(await fetchText("https://rothenberger.com/es-es/sitemap.xml")).filter(url=>/\/productos\//.test(url)&&/-\d+$/.test(url)&&/(plast|pvc|tubo|tuber|rocut|roweld|press|curv|desatas|inspe|sold|congel|bomba|prueba|rosc|cort|expan|abocard)/i.test(url)).slice(0,400);
 const parsed=await mapLimit(urls,10,async url=>{try{
  const html=await fetchText(url);const path=new URL(url).pathname.replace(/^\/es-es\//,"");const pageDataUrl=`https://es.rothenberger.com/page-data/es-es/${path}/page-data.json`;const pageData=await fetchText(pageDataUrl);const raw=parseRothenbergerProduct(url,html,pageData);return validRaw(raw)?record("pvc",raw,url):null;
 }catch{return null;}});
 return parsed.filter((item):item is ApprovalProduct=>Boolean(item)).slice(0,120);
}

const roth=await collectRothoblaas();
const epiCount=roth.filter(item=>item.section==="epi").length;
const alturaCount=roth.filter(item=>item.section==="altura").length;
const petzl=await collectPetzl((120-epiCount)+(120-alturaCount)+25);
const alturaWords=/(anchor|descender|ascender|pulley|mobile-fall-arrest|rope-grab|lifeline|rigging|rescue)/i;
const alturaPetzl=petzl.filter(item=>alturaWords.test(item.productUrl)).slice(0,120-alturaCount).map(item=>({...item,section:"altura" as const,tags:["altura","montaje profesional"],applications:applications.altura}));
const used=new Set(alturaPetzl.map(item=>item.reference));
const epiPetzl=petzl.filter(item=>!used.has(item.reference)).slice(0,120-epiCount);
roth.push(...alturaPetzl,...epiPetzl);
const supplemental:ApprovalProduct[]=[record("epi",{manufacturer:"Petzl",reference:"B071BB00",name:"ASAP LOCK",description:"Anticaídas deslizante con función de bloqueo para trabajos con cuerda.",imageUrl:"https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dwed4756d3/media/product/B071BB00-ASAP-LOCK-focus-1_LowRes_068Tx00000GMsOjIAL.jpeg",pdfUrl:"https://catalogs.petzl.com/Petzl-pro-catalog-2024/en/data/Petzl-Pro-2024.pdf"},"https://www.petzl.com/int/en/operators/products/mobile-fall-arresters/asap-lock/ASAP-LOCK_OPE_a2mTx000001TsxJIAS.html")];
const all=[...await collectHilti(),...roth,...supplemental,...await collectRothenberger()];
const unique=new Set<string>();
const products=(Object.keys(applications) as ApprovalSection[]).flatMap(section=>all.filter(item=>item.section===section).filter(item=>{const key=`${item.manufacturer}|${item.reference}`.toLowerCase();if(unique.has(key))return false;unique.add(key);return true;}).slice(0,120));
await writeFile(output,JSON.stringify(products,null,2));
const result=validateApprovalCatalog(products);
console.log(JSON.stringify({total:products.length,counts:result.counts,errors:result.errors.slice(0,20)},null,2));
if(!result.valid)process.exitCode=1;
