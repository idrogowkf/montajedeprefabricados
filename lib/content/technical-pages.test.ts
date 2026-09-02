import { describe, expect, it } from "vitest";
import { technicalPages } from "./technical-pages";

describe("technical SEO content", () => {
  it("covers every Sprint 5 search intent", () => {
    expect(technicalPages).toHaveLength(15);
    expect(technicalPages.map(page => page.slug)).toEqual(expect.arrayContaining([
      "montaje-puentes", "montaje-viaductos", "montaje-paneles-prefabricados",
      "montaje-fachadas-prefabricadas", "montaje-estructuras-metalicas",
      "montaje-naves-industriales", "montaje-edificios-prefabricados",
      "montaje-prefabricados-hormigon", "ingenieria-montaje", "planes-izado",
      "gruas-montaje", "transporte-especial", "seguridad-montaje",
      "control-geometrico", "secuencia-montaje",
    ]));
  });

  it("provides substantive, internally linked pages", () => {
    const paths = new Set(technicalPages.map(page => `/${page.category}/${page.slug}`));
    for (const page of technicalPages) {
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
      expect(page.sections.every(section => section.text.length >= 140)).toBe(true);
      expect(page.related.length).toBeGreaterThanOrEqual(2);
      expect(page.related.some(href => href.split("/").length > 2)).toBe(true);
      expect(page.related.every(href => paths.has(href))).toBe(true);
    }
    expect(new Set(technicalPages.map(page => page.checklist.join("|"))).size).toBe(15);
  });
});
