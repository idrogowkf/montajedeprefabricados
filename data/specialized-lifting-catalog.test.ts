import {describe,expect,it} from "vitest";
import {catalogProducts,isStorefrontComplete} from "./catalog";

describe("catálogo exclusivo de elevación y manipulación",()=>{
 it("publishes exactly the sixty approved lifting references",()=>{
  expect(catalogProducts).toHaveLength(60);
  expect(catalogProducts.every(product=>product.segments.includes("elevacion")&&product.segments.includes("utiles"))).toBe(true);
  expect(catalogProducts.every(product=>isStorefrontComplete(product))).toBe(true);
 });
 it("uses actual WIMAG product galleries instead of PDF cover thumbnails",()=>{
  const wimag=catalogProducts.filter(product=>product.brand==="WIMAG");
  expect(wimag).toHaveLength(57);
  expect(wimag.filter(product=>(product.imageUrls?.length??0)>=3).length).toBeGreaterThanOrEqual(30);
  expect(new Set(wimag.map(product=>product.imageUrl)).size).toBeGreaterThanOrEqual(50);
  expect(wimag.every(product=>!(product.imageUrls??[]).some(url=>/(Krug|Freimuth|QR[-_]|wimag-neg)/i.test(url)))).toBe(true);
  expect(wimag.every(product=>!product.imageUrl?.includes("datasheet")&&!/csm_\d+-(?:Manhole-Clamp|Pipe-Laying-Hook).*\.png/i.test(product.imageUrl??""))).toBe(true);
 });
 it("keeps official technical PDFs and traceable references",()=>{
  expect(catalogProducts.every(product=>product.datasheetUrl?.match(/\.pdf(?:$|[?#])/i)&&product.supplier.reference!=="PENDIENTE"&&product.sourceUrl.startsWith("https://"))).toBe(true);
 });
});
