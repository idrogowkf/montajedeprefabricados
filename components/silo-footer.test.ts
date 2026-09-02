import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
describe("global SILO navigation",()=>{it("links every required area from all pages",async()=>{const source=await readFile(new URL("./silo-footer.tsx",import.meta.url),"utf8");for(const href of ["/","/servicios","/tipologias","/ingenieria","/blog","/calculadoras","/preguntas-frecuentes"]){expect(source).toContain(`href:\"${href}\"`)}})});
