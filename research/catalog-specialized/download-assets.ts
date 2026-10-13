import {mkdir,readFile,stat,writeFile} from "node:fs/promises";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";
import type {SpecializedProduct} from "./schema";
import {isImageMime,isPdfSignature} from "./download-assets-lib";
import {validateSpecializedCatalog} from "./validate";

const root=fileURLToPath(new URL("../../",import.meta.url));
const catalogPath=join(root,"research/catalog-specialized/catalog.json");
const assetDir=join(root,"tmp/pdfs/catalog-specialized/assets");
const manifestPath=join(root,"research/catalog-specialized/assets-manifest.json");
await mkdir(assetDir,{recursive:true});
const products=JSON.parse(await readFile(catalogPath,"utf8")) as SpecializedProduct[];

async function mapLimit<T,R>(items:T[],limit:number,fn:(item:T,index:number)=>Promise<R>){const result=new Array<R>(items.length);let cursor=0;await Promise.all(Array.from({length:limit},async()=>{while(true){const index=cursor++;if(index>=items.length)return;result[index]=await fn(items[index],index);}}));return result;}
async function request(url:string,referer:string){let error:unknown;for(let attempt=0;attempt<3;attempt++)try{const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":"Mozilla/5.0 MontajePrefabricadoCatalog/2.0",accept:"*/*",referer}});if(response.status>=500)throw new Error(`HTTP ${response.status}`);return response;}catch(value){error=value;}throw error;}
async function firstBytes(response:Response,count=8){const reader=response.body?.getReader();if(!reader)return new Uint8Array();const {value}=await reader.read();await reader.cancel();return value?.slice(0,count)??new Uint8Array();}

const failures:string[]=[];
const manifest=await mapLimit(products,10,async(product,index)=>{
 try{
  const productStatus=product.checks.product>=200&&product.checks.product<400?product.checks.product:(await request(product.productUrl,product.productUrl)).status;
  const pdfResponse=await request(product.pdfUrl,product.productUrl);const pdfBytes=await firstBytes(pdfResponse);
  const filename=`${String(index+1).padStart(3,"0")}-${product.id}.jpg`;const localPath=join(assetDir,filename);
  let imageStatus=200;let imageMime="image/jpeg";let exists=false;try{exists=(await stat(localPath)).size>0;}catch{}
  if(!exists){const imageResponse=await request(product.imageUrl,product.productUrl);imageMime=imageResponse.headers.get("content-type")??"";imageStatus=imageResponse.status;const imageBuffer=Buffer.from(await imageResponse.arrayBuffer());if(!imageResponse.ok||!isImageMime(imageMime))throw new Error(`imagen ${imageResponse.status} ${imageMime}`);await sharp(imageBuffer,{failOn:"none"}).rotate().resize(520,360,{fit:"contain",background:"#ffffff"}).jpeg({quality:80,mozjpeg:true}).toFile(localPath);}
  if(productStatus<200||productStatus>=400)throw new Error(`producto HTTP ${productStatus}`);
  if(!pdfResponse.ok||!isPdfSignature(pdfBytes))throw new Error(`PDF ${pdfResponse.status} sin firma PDF`);
  product.checks={product:productStatus,pdf:pdfResponse.status,image:imageStatus,pdfSignature:true,imageMime:imageMime.split(";")[0]};
  if((index+1)%40===0)console.log(`Recursos verificados: ${index+1}/${products.length}`);
  return {id:product.id,image:localPath,pdfUrl:product.pdfUrl,imageUrl:product.imageUrl};
 }catch(error){failures.push(`${product.id}: ${String(error)}`);return {id:product.id,image:"",pdfUrl:product.pdfUrl,imageUrl:product.imageUrl};}
});
if(failures.length)throw new Error(`Recursos fallidos (${failures.length}):\n${failures.join("\n")}`);
const validation=validateSpecializedCatalog(products);if(!validation.valid)throw new Error(validation.errors.join("\n"));
await writeFile(catalogPath,JSON.stringify(products,null,2));await writeFile(manifestPath,JSON.stringify(manifest,null,2));
console.log(`Manifiesto: ${manifest.length} productos con imagen y PDF verificados`);
