import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { allSeoPages } from "../data/seo-pages";

describe("sitemap routes", () => {
  it("publishes only generated city routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://www.montajedeprefabricados.com/valladolid");
    expect(urls).toContain("https://www.montajedeprefabricados.com/coruna");
    expect(urls).not.toContain("https://www.montajedeprefabricados.com/mallorca");
    expect(urls).not.toContain("https://www.montajedeprefabricados.com/murcia");
  });

  it("contains every indexable SEO landing exactly once and excludes the duplicate legacy service", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    for (const page of allSeoPages) expect(paths).toContain(page.path);
    expect(paths).not.toContain("/servicios/montaje-prefabricado-hormigon");
    expect(new Set(paths).size).toBe(paths.length);
  });
});
