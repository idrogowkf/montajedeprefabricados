import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
describe("authenticated inquiry experience", () => {
  const source = () =>
    readFileSync(
      join(process.cwd(), "components/store/ProductInquiryPanel.tsx"),
      "utf8",
    );
  it("shows sign-in and profile-completion states with a resumable product intent", () => {
    const code = source();
    for (const text of [
      "useUser",
      "Inicia sesión para solicitar una oferta",
      "Completa tu perfil",
      "sessionStorage",
      "completar=1",
      "productId",
    ])
      expect(code).toContain(text);
  });
  it("uses the account identity and only asks technical request fields", () => {
    const code = source();
    expect(code).toContain("Datos de tu cuenta");
    expect(code).toContain("Editar datos");
    for (const duplicate of [
      'name="name"',
      'name="company"',
      'name="email"',
      'name="phone"',
    ])
      expect(code).not.toContain(duplicate);
    expect(code).toContain('name="message"');
    expect(code).toContain('name="consent"');
  });
  it("handles incomplete-profile responses and links success to real history", () => {
    const code = source();
    expect(code).toMatch(/response\.status\s*===\s*409/);
    expect(code).toContain("/mi-cuenta?seccion=solicitudes");
  });
});
