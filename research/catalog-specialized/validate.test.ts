import {describe,expect,it} from "vitest";
import {validateSpecializedCatalog} from "./validate";
import type {SpecializedProduct,SpecializedSection} from "./schema";

const quotas:Record<SpecializedSection,number>={hormigon:120,elevacion:60,altura:120,epi:120};
const make=(section:SpecializedSection,index:number):SpecializedProduct=>({
 id:`${section}-${index}`,section,family:"Montaje",manufacturer:"Fabricante",reference:`${section}-${index}`,
 originalName:"Original",nameEs:`Producto profesional ${index}`,descriptionEs:"Descripción técnica en español para montaje prefabricado.",
 applicationEs:"Montaje de piezas prefabricadas",capacityEs:"Según configuración",compatibilityEs:"Consultar ficha técnica",
 manufacturingCountry:index%2?"España":"Alemania",originPriority:index%2?1:2,originEvidenceUrl:`https://example.com/origen/${index}`,
 supplier:"Fabricante oficial",productUrl:`https://example.com/producto/${index}`,pdfUrl:`https://example.com/ficha/${index}.pdf`,imageUrl:`https://example.com/imagen/${index}.jpg`,
 verifiedAt:"2026-10-13",checks:{product:200,pdf:200,image:200,pdfSignature:true,imageMime:"image/jpeg"},
});

describe("specialized catalog validation",()=>{
 it("accepts the approved quotas and verified Spanish content",()=>{
  const products=(Object.entries(quotas) as [SpecializedSection,number][]).flatMap(([section,count])=>Array.from({length:count},(_,i)=>make(section,i)));
  expect(validateSpecializedCatalog(products)).toMatchObject({valid:true,counts:quotas,errors:[]});
 });
 it("rejects duplicates, missing origin evidence, invalid PDFs and visible English copy",()=>{
  const products=(Object.entries(quotas) as [SpecializedSection,number][]).flatMap(([section,count])=>Array.from({length:count},(_,i)=>make(section,i)));
  products[1]={...products[1],manufacturer:products[0].manufacturer,reference:products[0].reference};
  products[2]={...products[2],originEvidenceUrl:""};
  products[3]={...products[3],checks:{...products[3].checks,pdfSignature:false}};
  products[4]={...products[4],descriptionEs:"Professional lifting clamp for concrete beams"};
  const result=validateSpecializedCatalog(products);
  expect(result.valid).toBe(false);
  expect(result.errors.join("\n")).toMatch(/duplicada/i);
  expect(result.errors.join("\n")).toMatch(/origen/i);
  expect(result.errors.join("\n")).toMatch(/PDF/i);
  expect(result.errors.join("\n")).toMatch(/inglés/i);
 });
});
