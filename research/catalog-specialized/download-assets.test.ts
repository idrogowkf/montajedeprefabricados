import {describe,expect,it} from "vitest";
import {isImageMime,isPdfSignature} from "./download-assets-lib";

describe("specialized catalog asset verification",()=>{
 it("accepts real PDF bytes and rejects an HTML response",()=>{
  expect(isPdfSignature(Buffer.from("%PDF-1.7"))).toBe(true);
  expect(isPdfSignature(Buffer.from("<!doctype html>"))).toBe(false);
 });
 it("accepts supported product image media types",()=>{
  expect(isImageMime("image/jpeg")).toBe(true);
  expect(isImageMime("image/png; charset=binary")).toBe(true);
  expect(isImageMime("text/html")).toBe(false);
 });
});
