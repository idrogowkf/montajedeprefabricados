import { describe, expect, it } from "vitest";
import { parseContactRequest } from "./validation";

describe("parseContactRequest", () => {
  it("accepts a complete contact request", () => {
    expect(parseContactRequest({ nombre: "Ana", email: "ana@example.com", mensaje: "Necesito presupuesto" })).toEqual({ nombre: "Ana", empresa: "", email: "ana@example.com", mensaje: "Necesito presupuesto", origen: "landing" });
  });

  it("rejects missing required fields", () => {
    expect(() => parseContactRequest({ nombre: "Ana" })).toThrow("Faltan campos obligatorios");
  });
});
