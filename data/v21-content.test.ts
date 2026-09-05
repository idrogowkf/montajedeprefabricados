import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { capabilities, processSteps } from "./v21-content";

describe("V2.1 technical navigation", () => {
  it("maps every capability to a unique technical route", () => {
    expect(capabilities.map(item => item.href)).toEqual([
      "/servicios/montaje-prefabricados",
      "/servicios/ingenieria-de-montaje",
      "/servicios/gruas-y-maniobras",
      "/servicios/logistica-de-obra",
      "/servicios/asistencia-tecnica",
    ]);
  });

  it("gives every process phase an explanation, inputs, and output", () => {
    for (const step of processSteps) {
      expect(step.summary.length).toBeGreaterThan(90);
      expect(step.inputs.length).toBeGreaterThan(2);
      expect(step.output.length).toBeGreaterThan(40);
    }
  });

  it("keeps form controls aligned without stretching grid rows", () => {
    const css = readFileSync(resolve(process.cwd(), "app/v21-extra.css"), "utf8");
    expect(css).toMatch(/\.v21-home \.field\{[^}]*align-content:start/);
  });

  it("does not expose third-party source promotion in the technical centre", () => {
    const source = readFileSync(resolve(process.cwd(), "components/v21/TechnicalCenter.tsx"), "utf8");
    const blockedNames = ["and" + "ece", "prefabricado" + " seguro", "prefabricado" + "seguro"];
    for (const name of blockedNames) expect(source.toLowerCase()).not.toContain(name);
  });

  it("links the shared brand back to the home anchor from every route", () => {
    const source = readFileSync(resolve(process.cwd(), "components/v21/Brand.tsx"), "utf8");
    expect(source).toContain('href="/#inicio"');
  });

  it("uses the connected production domain for canonical discovery", () => {
    for (const file of ["app/layout.tsx", "app/robots.ts", "app/sitemap.ts", "lib/seo.ts"]) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source).toContain("montajedeprefabricados.com");
    }
  });
});
