import {describe, expect, it} from "vitest";
import {parseRfqRequest} from "./validation";

const valid = {companyName: "Prefabricados Norte SL", nif: "B12345678", contactName: "Ana Ruiz", email: "ana@example.com", phone: "600123123", deliveryLocation: "Madrid", notes: "", idempotencyKey: "b8098b34-e6bc-4b9f-a41a-9fb3a48f10ca", items: [{slug: "guantes-proteccion-mecanica", quantity: 12}]};

describe("RFQ validation", () => {
  it("accepts a valid business quotation request", () => {
    expect(parseRfqRequest(valid).items[0]).toEqual({slug: "guantes-proteccion-mecanica", quantity: 12});
  });

  it.each([0, -1, 1000])("rejects invalid quantity %s", (quantity) => {
    expect(() => parseRfqRequest({...valid, items: [{...valid.items[0], quantity}]})).toThrow("Cantidad no válida");
  });

  it("rejects unknown products and empty carts", () => {
    expect(() => parseRfqRequest({...valid, items: []})).toThrow("Añade al menos un producto");
    expect(() => parseRfqRequest({...valid, items: [{slug: "inventado", quantity: 1}]})).toThrow("Producto no válido");
  });
});
