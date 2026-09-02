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

  it("keeps image and service interaction fallbacks", async () => {
    const projects = await readFile(new URL("./landing/projects-section.tsx", import.meta.url), "utf8");
    const services = await readFile(new URL("./landing/services-section.tsx", import.meta.url), "utf8");

    expect(projects).toContain("SafeImage");
    expect(services).toContain('href="#contacto"');
    expect(services).toContain("group-hover:block");
  });
});
