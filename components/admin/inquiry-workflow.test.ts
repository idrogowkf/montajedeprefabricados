import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
describe("administrative inquiry workflow", () => {
  it("protects and validates status updates", () => {
    const route = readFileSync(
      join(process.cwd(), "app/api/admin/product-inquiries/route.ts"),
      "utf8",
    );
    const db = readFileSync(
      join(process.cwd(), "lib/customer-account-db.ts"),
      "utf8",
    );
    expect(route).toContain("requireAdminIdentity");
    expect(route).toContain("updateInquiryStatus");
    for (const status of [
      "received",
      "reviewing",
      "awaiting_customer",
      "quoted",
      "closed",
    ])
      expect(db).toContain(status);
    expect(route).toContain("adminNotes.length>2000");
  });
  it("renders profile context and an operational editor", () => {
    const ui = readFileSync(
      join(process.cwd(), "components/admin/CatalogAdmin.tsx"),
      "utf8",
    );
    for (const value of [
      "profile_snapshot",
      "Estado visible para el cliente",
      "Nota interna",
      "Guardar seguimiento",
      "Guardando…",
      "No se pudo guardar",
      "public_status",
    ])
      expect(ui).toContain(value);
  });
});
