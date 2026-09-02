import { afterEach, describe, expect, it, vi } from "vitest";

describe("contact route module", () => {
  afterEach(() => {
    vi.resetModules();
    delete process.env.RESEND_API_KEY;
  });

  it("can be imported during a production build without email credentials", async () => {
    delete process.env.RESEND_API_KEY;

    await expect(import("./route")).resolves.toMatchObject({
      POST: expect.any(Function),
    });
  });
});
