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
});
