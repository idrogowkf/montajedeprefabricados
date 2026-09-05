import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap routes", () => {
  it("publishes only generated city routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://www.montajedeprefabricados.com/valladolid");
    expect(urls).toContain("https://www.montajedeprefabricados.com/coruna");
    expect(urls).not.toContain("https://www.montajedeprefabricados.com/mallorca");
    expect(urls).not.toContain("https://www.montajedeprefabricados.com/murcia");
  });
});
