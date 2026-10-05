import { describe, expect, it } from "vitest";
import { calculatePrice, grossMarginPercent } from "./pricing";

describe("commercial price engine", () => {
  it("derives sale price from landed cost and target gross margin", () => {
    const result = calculatePrice({cost: 80, inboundShipping: 8, handling: 2, contingencyPercent: 5, targetMarginPercent: 30, vatPercent: 21});
    expect(result.landedCost).toBe(94.5);
    expect(result.salePriceNet).toBe(135);
    expect(result.grossProfit).toBe(40.5);
    expect(result.salePriceVat).toBe(163.35);
  });

  it("measures margin against net sale rather than applying markup", () => {
    expect(grossMarginPercent(75, 100)).toBe(25);
  });

  it("rejects impossible target margins", () => {
    expect(() => calculatePrice({cost: 10, inboundShipping: 0, handling: 0, contingencyPercent: 0, targetMarginPercent: 100, vatPercent: 21})).toThrow();
  });
});
