import {specializedSections,type SpecializedProduct,type SpecializedSection,type SpecializedValidation} from "./schema";

export const minimumQuotas:Record<SpecializedSection,number>={hormigon:120,elevacion:60,altura:120,epi:120};
const english=/\b(?:professional|lifting|clamp|concrete|beam|anchor|safety|harness|helmet|working|height|fall protection|load|capacity)\b/i;
const success=(status:number)=>status>=200&&status<400;
const escapeRegExp=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

export function validateSpecializedCatalog(products:SpecializedProduct[]):SpecializedValidation{
 const counts=Object.fromEntries(specializedSections.map(section=>[section,products.filter(p=>p.section===section).length])) as Record<SpecializedSection,number>;
 const errors:string[]=[];const ids=new Set<string>();const references=new Set<string>();
 for(const section of specializedSections)if(counts[section]<minimumQuotas[section])errors.push(`${section}: mínimo ${minimumQuotas[section]} y hay ${counts[section]}`);
 for(const p of products){
  if(ids.has(p.id))errors.push(`${p.id}: id duplicado`);ids.add(p.id);
  const ref=`${p.manufacturer}|${p.reference}`.toLowerCase();if(references.has(ref))errors.push(`${p.id}: referencia duplicada`);references.add(ref);
  for(const [field,value] of Object.entries({family:p.family,manufacturer:p.manufacturer,reference:p.reference,nameEs:p.nameEs,descriptionEs:p.descriptionEs,applicationEs:p.applicationEs,capacityEs:p.capacityEs,compatibilityEs:p.compatibilityEs,manufacturingCountry:p.manufacturingCountry,originEvidenceUrl:p.originEvidenceUrl,productUrl:p.productUrl,pdfUrl:p.pdfUrl,imageUrl:p.imageUrl}))if(!String(value).trim())errors.push(`${p.id}: falta ${field}`);
  if(!p.originEvidenceUrl)errors.push(`${p.id}: falta evidencia de origen`);
  const visible=`${p.nameEs} ${p.descriptionEs} ${p.applicationEs} ${p.capacityEs} ${p.compatibilityEs}`.replace(new RegExp(escapeRegExp(p.reference),"gi"),"");
  if(english.test(visible))errors.push(`${p.id}: contenido visible en inglés`);
  if(!success(p.checks.product)||!success(p.checks.pdf)||!success(p.checks.image))errors.push(`${p.id}: recurso HTTP no válido`);
  if(!p.checks.pdfSignature)errors.push(`${p.id}: PDF no válido`);
  if(!p.checks.imageMime.startsWith("image/"))errors.push(`${p.id}: imagen no válida`);
 }
 return {valid:errors.length===0,counts,errors};
}
