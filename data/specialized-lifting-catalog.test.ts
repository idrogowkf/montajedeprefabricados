import {describe,expect,it} from "vitest";
import {catalogProducts,isStorefrontComplete} from "./catalog";

describe("catálogo aprobado de elevación y manipulación",()=>{
 const lifting=()=>catalogProducts.filter(product=>product.category==="elevacion");
 it("preserves exactly the sixty approved lifting references",()=>{
  expect(lifting()).toHaveLength(60);
  expect(lifting().every(product=>product.segments.includes("elevacion")&&product.segments.includes("utiles"))).toBe(true);
  expect(lifting().every(product=>isStorefrontComplete(product))).toBe(true);
 });
 it("uses actual WIMAG product galleries instead of PDF cover thumbnails",()=>{
  const wimag=lifting().filter(product=>product.brand==="WIMAG");
  expect(wimag).toHaveLength(57);
  expect(wimag.filter(product=>(product.imageUrls?.length??0)>=3).length).toBeGreaterThanOrEqual(30);
  expect(new Set(wimag.map(product=>product.imageUrl)).size).toBeGreaterThanOrEqual(50);
  expect(wimag.every(product=>!(product.imageUrls??[]).some(url=>/(Krug|Freimuth|QR[-_]|wimag-neg)/i.test(url)))).toBe(true);
  expect(wimag.every(product=>!product.imageUrl?.includes("datasheet")&&!/csm_\d+-(?:Manhole-Clamp|Pipe-Laying-Hook).*\.png/i.test(product.imageUrl??""))).toBe(true);
 });
 it("keeps official technical PDFs and traceable references",()=>{
  expect(lifting().every(product=>product.datasheetUrl?.match(/\.pdf(?:$|[?#])/i)&&product.supplier.reference!=="PENDIENTE"&&product.sourceUrl.startsWith("https://"))).toBe(true);
 });
});
