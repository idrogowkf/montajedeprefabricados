import {describe,expect,it} from "vitest";
import {buildCatalog,spanishFamilyName,translateLegacyProduct} from "./normalize";

describe("Spanish catalog normalization",()=>{
 it("translates legacy PPE names without changing the reference",()=>{
  const result=translateLegacyProduct({id:"petzl-a",section:"epi",manufacturer:"Petzl",reference:"A010AA00",name:"VERTEX VENT lightweight helmet",description:"Lightweight ventilated helmet",applications:["Protection"],supplier:"Petzl",origin:"Francia",productUrl:"https://example.com/p",pdfUrl:"https://example.com/p.pdf",imageUrl:"https://example.com/p.jpg",verifiedAt:"2026-10-13",checks:{product:200,pdf:200,image:200,pdfSignature:true,imageMime:"image/jpeg"}} as never);
  expect(result.nameEs).toBe("Casco ventilado Petzl VERTEX VENT");
  expect(result.reference).toBe("A010AA00");
  expect(result.descriptionEs).not.toMatch(/lightweight|helmet/i);
 });
 it("assigns Spanish functional names to lifting equipment",()=>{
  expect(spanishFamilyName("https://wimag.de/en/pipe-suspension-grab.html","110")).toBe("Pinza suspendida para tubos WIMAG 110");
  expect(spanishFamilyName("https://wimag.de/en/lifting-beam.html","402")).toBe("Balancín de elevación WIMAG 402");
 });
 it("reserves unselected candidates for the concrete section",()=>{
  const candidate=(source:"wimag"|"pfeifer",reference:string)=>({source,manufacturer:source==="wimag"?"WIMAG":"PFEIFER",reference,originalName:reference,nameEs:`Producto ${reference}`,productUrl:`https://example.com/${source}/${reference}`,pdfUrl:`https://example.com/${reference}.pdf`,imageUrl:`https://example.com/${reference}.jpg`,capacityEs:"Según ficha técnica",manufacturingCountry:"Alemania",originPriority:2,originEvidenceUrl:"https://example.com/origen"});
  const candidates=[...Array.from({length:61},(_,i)=>candidate("wimag",`W${i}`)),...Array.from({length:121},(_,i)=>candidate("pfeifer",`P${i}`))];
  const result=buildCatalog(candidates as never,[]);
  expect(result.filter(p=>p.section==="elevacion")).toHaveLength(60);
  expect(result.filter(p=>p.section==="hormigon")).toHaveLength(120);
 });
});
