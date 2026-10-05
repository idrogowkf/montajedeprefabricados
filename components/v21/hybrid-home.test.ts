import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("hybrid home composition", () => {
  it("offers commerce and technical paths before continuing with the technical journey", () => {
    const landing = readFileSync(join(process.cwd(), "components/landing-v21.tsx"), "utf8");
    const hero = readFileSync(join(process.cwd(), "components/v21/Hero.tsx"), "utf8");

    const copy = hero.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
    expect(copy).toContain("necesito material");
    expect(copy).toContain("tengo un montaje que resolver");
    expect(landing).toContain("StoreDiscovery");
    expect(landing.indexOf("<StoreDiscovery")).toBeLessThan(landing.indexOf("<PositioningSection"));
  });

  it("links the protected administration area from the footer",()=>{
    const footer=readFileSync(join(process.cwd(),"components/v21/Footer.tsx"),"utf8");
    expect(footer).toContain('href="/administracion"');
    expect(footer).toContain("Zona de administración");
  });
});
