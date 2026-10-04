import {describe, expect, it, vi} from "vitest";
import {submitRfq} from "@/lib/rfq/service";
import type {RfqRequest} from "@/lib/rfq/types";

const request: RfqRequest = {companyName: "Prefabricados Norte SL", nif: "B12345678", contactName: "Ana Ruiz", email: "ana@example.com", phone: "", deliveryLocation: "Madrid", notes: "", idempotencyKey: "b8098b34-e6bc-4b9f-a41a-9fb3a48f10ca", items: [{slug: "guantes-proteccion-mecanica", quantity: 12}]};

describe("RFQ submission service", () => {
  it("keeps the saved request when email notification fails", async () => {
    const create = vi.fn().mockResolvedValue({id: "rfq-1", reference: "SOL-2026-0001", duplicate: false});
    const notify = vi.fn().mockRejectedValue(new Error("mail offline"));
    const result = await submitRfq(request, {create}, notify);
    expect(result).toEqual({id: "rfq-1", reference: "SOL-2026-0001", duplicate: false, notification: "pending"});
    expect(create).toHaveBeenCalledOnce();
  });

  it("does not notify twice for an idempotent duplicate", async () => {
    const create = vi.fn().mockResolvedValue({id: "rfq-1", reference: "SOL-2026-0001", duplicate: true});
    const notify = vi.fn();
    const result = await submitRfq(request, {create}, notify);
    expect(result.duplicate).toBe(true);
    expect(notify).not.toHaveBeenCalled();
  });
});
