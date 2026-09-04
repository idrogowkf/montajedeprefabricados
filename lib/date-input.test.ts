import { describe, expect, it } from "vitest";
import { formatSpanishDate, parseSpanishDate } from "./date-input";

describe("project date conversion", () => {
  it("converts a Spanish date to the canonical ISO value", () => {
    expect(parseSpanishDate("04/09/2026")).toBe("2026-09-04");
  });

  it("formats an ISO value for manual entry", () => {
    expect(formatSpanishDate("2026-09-04")).toBe("04/09/2026");
  });

  it("rejects impossible dates", () => {
    expect(parseSpanishDate("31/02/2026")).toBe("");
  });

  it("accepts leap days only in leap years", () => {
    expect(parseSpanishDate("29/02/2024")).toBe("2024-02-29");
    expect(parseSpanishDate("29/02/2025")).toBe("");
  });
});
