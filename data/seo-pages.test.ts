import { describe, expect, it } from "vitest";
import { allSeoPages, citySeoPages, serviceSeoPages, typeSeoPages } from "./seo-pages";
import { buildPageSchemas, createPageMetadata, site } from "../lib/seo";

describe("SEO architecture", () => {
  it("assigns every landing a unique path, title, description and query intent", () => {
    expect(serviceSeoPages).toHaveLength(6);
    expect(typeSeoPages).toHaveLength(6);
    expect(citySeoPages).toHaveLength(10);
    expect(new Set(allSeoPages.map((page) => page.path)).size).toBe(allSeoPages.length);
    expect(new Set(allSeoPages.map((page) => page.title)).size).toBe(allSeoPages.length);
    expect(new Set(allSeoPages.map((page) => page.description)).size).toBe(allSeoPages.length);
    expect(new Set(allSeoPages.map((page) => page.primaryQuery)).size).toBe(allSeoPages.length);
    for (const page of allSeoPages) {
      expect(page.title.length, `${page.path} title`).toBeLessThanOrEqual(60);
      expect(page.description.length, `${page.path} description`).toBeGreaterThanOrEqual(120);
      expect(page.description.length, `${page.path} description`).toBeLessThanOrEqual(170);
    }
  });

  it("creates self-referencing metadata and social cards", () => {
    for (const page of allSeoPages) {
      const metadata = createPageMetadata(page);
      expect(metadata.alternates?.canonical).toBe(`${site.url}${page.path}`);
      expect(metadata.openGraph?.url).toBe(`${site.url}${page.path}`);
      expect(metadata.openGraph?.title).toBe(page.title);
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    }
  });

  it("creates Service, FAQ, Breadcrumb and WebPage schema matching visible content", () => {
    for (const page of allSeoPages) {
      const schemas = buildPageSchemas(page);
      expect(schemas.map((schema) => schema["@type"])).toEqual([
        "WebPage",
        "BreadcrumbList",
        "Service",
        "FAQPage",
      ]);
      expect(page.faqs.length).toBeGreaterThanOrEqual(3);
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
      expect(page.related.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("does not publish unverifiable marketing claims", () => {
    const serialized = JSON.stringify(allSeoPages).toLowerCase();
    for (const claim of ["somos especialistas", "flota propia", "equipos certificados", "experiencia en", "hasta 150 t", "80–500t"]) {
      expect(serialized).not.toContain(claim);
    }
    expect(serialized).not.toMatch(/\bsla(?:s)?\b/);
  });

  it("does not reuse FAQ or section copy between landings", () => {
    const faqs = allSeoPages.flatMap(page => page.faqs.map(faq => `${faq.question}|${faq.answer}`));
    const sections = allSeoPages.flatMap(page => page.sections.map(section => `${section.title}|${section.body}`));
    expect(new Set(faqs).size).toBe(faqs.length);
    expect(new Set(sections).size).toBe(sections.length);
  });
});
