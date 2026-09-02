import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("landing architecture", () => {
  it("keeps the page composition on the server and below 100 lines", async () => {
    const source = await readFile(new URL("./landing.tsx", import.meta.url), "utf8");

    expect(source).not.toMatch(/^['\"]use client['\"];?/);
    expect(source.split(/\r?\n/).length).toBeLessThan(100);
  });

  it("uses the field names expected by the contact endpoint", async () => {
    const source = await readFile(new URL("./lead-form.tsx", import.meta.url), "utf8");

    expect(source).toContain('name="email"');
    expect(source).toContain('name="mensaje"');
    expect(source).not.toContain('name="contacto"');
    expect(source).not.toContain('name="detalle"');
  });

  it("preserves the calculator conversion and contact fallbacks", async () => {
    const calculator = await readFile(new URL("./calculator.tsx", import.meta.url), "utf8");
    const form = await readFile(new URL("./lead-form.tsx", import.meta.url), "utf8");
    const contact = await readFile(new URL("./landing/contact-section.tsx", import.meta.url), "utf8");

    expect(calculator).toContain('router.push("/presupuesto")');
    expect(form).toContain("finally");
    expect(contact).toContain("https://wa.me/34624473123");
  });

  it("keeps image fallbacks and exposes service details without hover", async () => {
    const projects = await readFile(new URL("./landing/projects-section.tsx", import.meta.url), "utf8");
    const services = await readFile(new URL("./landing/services-section.tsx", import.meta.url), "utf8");

    expect(projects).toContain("SafeImage");
    expect(services).toContain('href="#contacto"');
    expect(services).not.toContain("group-hover:block");
    expect(services).not.toContain("sm:hidden");
  });

  it("does not present unverified projects, partners or operational claims", async () => {
    const files = ["hero.tsx", "services-section.tsx", "process-section.tsx", "projects-section.tsx", "trust-section.tsx"];
    const source = (await Promise.all(files.map(file => readFile(new URL(`./landing/${file}`, import.meta.url), "utf8")))).join("\n");

    expect(source).not.toMatch(/Ibercarga|Obras destacadas|0 Incidentes|24 meses|3M€|póliza vigente|\bSLA\b/i);
    expect(source).not.toMatch(/cuadrillas expertas|equipos certificados/i);
  });

  it("connects the home with technical hubs and search intents", async () => {
    const hero = await readFile(new URL("./landing/hero.tsx", import.meta.url), "utf8");
    const projects = await readFile(new URL("./landing/projects-section.tsx", import.meta.url), "utf8");
    const trust = await readFile(new URL("./landing/trust-section.tsx", import.meta.url), "utf8");

    expect(hero).toContain("montaje de prefabricados de hormigón");
    expect(projects).toContain('/tipos/puentes');
    expect(projects).toContain('/tipos/naves-industriales');
    expect(trust).toContain('/ingenieria');
    expect(trust).toContain('/guias');
  });
});
