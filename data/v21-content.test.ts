import { describe, expect, it } from "vitest";
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
});
