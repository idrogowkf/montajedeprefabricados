import {describe,expect,it} from "vitest";
import {validateApprovalCatalog} from "./validate";
import type {ApprovalProduct,ApprovalSection} from "./schema";

const sections:ApprovalSection[]=["hormigon","acero","madera","pvc","altura","epi"];
const product=(section:ApprovalSection,index:number):ApprovalProduct=>({
 id:`${section}-${index}`,section,tags:["montaje"],manufacturer:`Marca ${section}`,reference:`${section.toUpperCase()}-${index}`,
 name:`Producto ${index}`,description:"Producto profesional identificado para operaciones de montaje prefabricado.",applications:["Montaje profesional"],
 supplier:`Marca ${section}`,origin:"UE",productUrl:`https://example.com/${section}/${index}`,pdfUrl:`https://example.com/${section}/${index}.pdf`,imageUrl:`https://example.com/${section}/${index}.jpg`,
 verifiedAt:"2026-10-09",checks:{product:200,pdf:200,image:200,pdfSignature:true,imageMime:"image/jpeg"},
});

describe("approval catalog validation",()=>{
 it("accepts exactly 120 unique verified products per section",()=>{
  const products=sections.flatMap(section=>Array.from({length:120},(_,index)=>product(section,index)));
  expect(validateApprovalCatalog(products)).toEqual({valid:true,counts:Object.fromEntries(sections.map(section=>[section,120])),errors:[]});
 });
 it("rejects incomplete quotas, duplicate references and non-PDF documents",()=>{
  const products=sections.flatMap(section=>Array.from({length:120},(_,index)=>product(section,index)));
  products.pop();
  products[1]={...products[1],manufacturer:products[0].manufacturer,reference:products[0].reference};
  products[2]={...products[2],checks:{...products[2].checks,pdfSignature:false}};
  const result=validateApprovalCatalog(products);
  expect(result.valid).toBe(false);
  expect(result.errors.join("\n")).toMatch(/epi: se esperaban 120/);
  expect(result.errors.join("\n")).toMatch(/referencia duplicada/i);
  expect(result.errors.join("\n")).toMatch(/PDF no válido/i);
 });
});
