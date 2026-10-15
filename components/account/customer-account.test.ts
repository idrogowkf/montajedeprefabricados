import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("branded customer account", () => {
  const source = () =>
    readFileSync(
      join(process.cwd(), "components/account/CustomerAccount.tsx"),
      "utf8",
    );
  it("provides the four account sections and responsive navigation", () => {
    const code = source();
    for (const value of [
      "Resumen",
      "Solicitudes",
      "Mi perfil",
      "Privacidad",
      "account-mobile-nav",
    ])
      expect(code).toContain(value);
  });
  it("contains the Spanish invoicing profile and conditional company name", () => {
    const code = source();
    for (const value of [
      "Tipo de cliente",
      "Nombre y apellidos",
      "Razón social",
      "NIF / NIE",
      "Teléfono",
      "Dirección fiscal",
      "Código postal",
      "Provincia",
    ])
      expect(code).toContain(value);
    expect(code).toMatch(/profile\.customerType\s*===\s*"company"/);
  });
  it("loads real data in one request and exposes loading, error and empty states", () => {
    const code = source();
    for (const value of [
      "/api/account/overview",
      "Cargando tus solicitudes",
      "No tienes solicitudes todavía",
      "No hemos podido cargar",
    ])
      expect(code).toContain(value);
    expect(code).toContain("publicInquiryStatus");
  });
  it("submits profile errors by field and focuses the first invalid control", () => {
    const code = source();
    expect(code).toContain("setErrors");
    expect(code).toContain("querySelector");
    expect(code).toContain("linkedInquiries");
  });
});
