import { describe, expect, it } from "vitest";
import { technicalServices } from "./technical-services";

describe("technical service cluster", () => {
  it("contains six unique and substantial services", () => {
    expect(technicalServices).toHaveLength(6);
    expect(new Set(technicalServices.map(item=>item.slug)).size).toBe(6);
    for (const service of technicalServices) {
      expect(service.intro.length).toBeGreaterThan(180);
      expect(service.sections.length).toBeGreaterThanOrEqual(3);
      expect(service.related.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("gives lifting plans dedicated engineering coverage", () => {
    const lifting = technicalServices.find(item=>item.slug==="lifting-plan");
    const content = JSON.stringify(lifting);
    for (const term of ["radio","tablas de carga","aparejos","estabilidad temporal","entregables"]) expect(content.toLowerCase()).toContain(term);
  });
});
