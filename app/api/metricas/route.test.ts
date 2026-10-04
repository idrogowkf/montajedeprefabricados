import {describe, expect, it} from "vitest";
import {parseMetricEvent} from "@/lib/catalog/event-validation";

describe("catalog metrics endpoint input", () => {
  it("accepts product funnel events without customer data", () => {
    expect(parseMetricEvent({type: "cart_add", productSlug: "casco-obra"})).toEqual({type: "cart_add", productSlug: "casco-obra"});
  });
  it("rejects unknown products and event types", () => {
    expect(() => parseMetricEvent({type: "email", productSlug: "casco-obra"})).toThrow("Evento no válido");
    expect(() => parseMetricEvent({type: "cart_add", productSlug: "otro"})).toThrow("Producto no válido");
  });
});
