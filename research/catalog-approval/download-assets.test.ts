import {describe,expect,it} from "vitest";
import {isImageMime,isPdfSignature} from "./download-assets-lib";

describe("catalog asset verification",()=>{
 it("accepts a real PDF signature and rejects HTML",()=>{
  expect(isPdfSignature(Buffer.from("%PDF-1.7"))).toBe(true);
  expect(isPdfSignature(Buffer.from("<html>"))).toBe(false);
 });
 it("accepts raster product images only",()=>{
  expect(isImageMime("image/jpeg")).toBe(true);
  expect(isImageMime("image/webp; charset=binary")).toBe(true);
  expect(isImageMime("text/html")).toBe(false);
 });
});
