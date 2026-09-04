import { describe, expect, it } from "vitest";
import { prestudyTarget, whatsappUrl } from "./floating-actions";

describe("global contact actions", () => {
  it("uses the local anchor on Home and the Home anchor elsewhere", () => {
    expect(prestudyTarget("/")).toBe("#preestudio");
    expect(prestudyTarget("/servicios/lifting-plan")).toBe("/#preestudio");
  });

  it("uses the verified number and a prefilled project message", () => {
    expect(whatsappUrl).toContain("34624473123");
    expect(decodeURIComponent(whatsappUrl)).toContain("montaje prefabricado");
  });
});
