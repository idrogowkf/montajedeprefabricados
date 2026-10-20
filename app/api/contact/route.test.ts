import { afterEach, describe, expect, it, vi } from "vitest";

describe("contact API module", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("can be imported during a build without RESEND_API_KEY", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    await expect(import("./route")).resolves.toHaveProperty("POST");
  }, 15_000);

  it("rejects an incomplete payload with HTTP 400", async () => {
    const { POST } = await import("./route");
    const response = await POST(new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });

  it("rejects an invalid email address with HTTP 400", async () => {
    const { POST } = await import("./route");
    const response = await POST(new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nombre: "Ana", email: "no-es-un-email", mensaje: "Necesito información" }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: "Introduce un correo electrónico válido." });
  });

  it("returns an error status when the mail provider rejects the message", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.doMock("resend", () => ({ Resend: class { emails = { send: async () => ({ error: { message: "rejected" } }) }; } }));
    const { POST } = await import("./route");
    const response = await POST(new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nombre: "Ana", email: "ana@example.com", mensaje: "Necesito información" }),
    }));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
