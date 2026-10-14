import {describe,expect,it} from "vitest";
import {catalogProducts,filterCatalog,filterStoreCatalog,hasStoreImage,isPublicationReady,isStorefrontComplete} from "./catalog";

describe("catálogo técnico multifamilia",()=>{
 it("preserves the approved sixty lifting references inside the expanded catalog",()=>{
  const lifting=catalogProducts.filter(product=>product.category==="elevacion");
  expect(catalogProducts).toHaveLength(157);
  expect(lifting).toHaveLength(60);
  expect(lifting.every(product=>product.segments.includes("elevacion")&&product.segments.includes("utiles"))).toBe(true);
  expect(lifting.some(product=>product.name.toLowerCase().includes("pinza"))).toBe(true);
  expect(lifting.some(product=>product.name.toLowerCase().includes("gancho"))).toBe(true);
 });
 it("keeps every reference traceable and quote-only until costs are verified",()=>{
  expect(catalogProducts.every(product=>product.supplier.name&&product.supplier.reference!=="PENDIENTE"&&product.sourceUrl.startsWith("https://"))).toBe(true);
  expect(catalogProducts.every(product=>product.commercial.status==="quote"&&product.commercial.cost===0&&!product.commercial.costVerified)).toBe(true);
  expect(catalogProducts.every(product=>!isPublicationReady(product))).toBe(true);
 });
 it("publishes every recovered card with an official image and keeps verified PDFs",()=>{
  expect(catalogProducts.filter(hasStoreImage)).toHaveLength(157);
  expect(catalogProducts.filter(isStorefrontComplete)).toHaveLength(60);
  expect(catalogProducts.filter(product=>product.category==="elevacion").every(product=>product.datasheetUrl?.match(/\.pdf(?:$|[?#])/i))).toBe(true);
 });
 it("filters the specialized catalog by plain language and segment",()=>{
  expect(filterCatalog(catalogProducts,"pinza","todos").length).toBeGreaterThan(0);
  expect(filterCatalog(catalogProducts,"balancin","todos").length).toBeGreaterThan(0);
  expect(filterStoreCatalog(catalogProducts,"","elevacion","hormigon")).toHaveLength(60);
 });
});
