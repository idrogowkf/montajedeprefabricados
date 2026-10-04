import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

describe("shop experience", () => {
  it("labels the catalogue and cart as non-binding quotation flow", async () => {
    const page = await readFile(new URL("../../app/tienda/page.tsx", import.meta.url), "utf8");
    const browser = await readFile(new URL("./catalog-browser.tsx", import.meta.url), "utf8");
    expect(page).toContain("Catálogo profesional de alta rotación");
    expect(browser).toContain("Precio y disponibilidad bajo consulta");
    expect(browser).toContain("Añadir a solicitud");
  });

  it("keeps an accessible cart draft and sends it to the quote route", async () => {
    const cart = await readFile(new URL("./rfq-cart.tsx", import.meta.url), "utf8");
    expect(cart).toContain('aria-label="Cesta de solicitud"');
    expect(cart).toContain("/solicitar-oferta");
    expect(cart).toContain("mp-rfq-cart");
    expect(cart).toContain("if (!lines.length) return null");
  });
});
