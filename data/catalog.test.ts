import {describe,expect,it} from "vitest";
import {catalogProducts,filterCatalog,filterStoreCatalog,hasStoreImage,isPublicationReady,isStorefrontComplete} from "./catalog";

describe("catálogo de elevación y manipulación",()=>{
 it("contains only the approved sixty lifting references",()=>{
  expect(catalogProducts).toHaveLength(60);
  expect(catalogProducts.every(product=>product.segments.includes("elevacion")&&product.segments.includes("utiles"))).toBe(true);
  expect(catalogProducts.some(product=>product.name.toLowerCase().includes("pinza"))).toBe(true);
  expect(catalogProducts.some(product=>product.name.toLowerCase().includes("gancho"))).toBe(true);
 });
 it("keeps every reference traceable and quote-only until costs are verified",()=>{
  expect(catalogProducts.every(product=>product.supplier.name&&product.supplier.reference!=="PENDIENTE"&&product.sourceUrl.startsWith("https://"))).toBe(true);
  expect(catalogProducts.every(product=>product.commercial.status==="quote"&&product.commercial.cost===0&&!product.commercial.costVerified)).toBe(true);
  expect(catalogProducts.every(product=>!isPublicationReady(product))).toBe(true);
 });
 it("publishes every approved card with an official image and PDF",()=>{
  expect(catalogProducts.filter(hasStoreImage)).toHaveLength(60);
  expect(catalogProducts.filter(isStorefrontComplete)).toHaveLength(60);
  expect(catalogProducts.every(product=>product.datasheetUrl?.match(/\.pdf(?:$|[?#])/i))).toBe(true);
 });
 it("filters the specialized catalog by plain language and segment",()=>{
  expect(filterCatalog(catalogProducts,"pinza","todos").length).toBeGreaterThan(0);
  expect(filterCatalog(catalogProducts,"balancin","todos").length).toBeGreaterThan(0);
  expect(filterStoreCatalog(catalogProducts,"","elevacion","hormigon")).toHaveLength(60);
 });
});
