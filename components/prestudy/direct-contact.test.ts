import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("direct contact from the prestudy", () => {
  const prestudy = readFileSync(
    join(process.cwd(), "components/prestudy/PreStudy.tsx"),
    "utf8",
  );

  it("replaces the static alternative-contact text with the interactive contact component", () => {
    expect(prestudy).toContain('import DirectContact from "./DirectContact"');
    expect(prestudy).toContain("<DirectContact />");
    expect(prestudy).not.toContain("Contacto alternativo");
    expect(prestudy).not.toContain("ofertas@montajesprefabricados.com");
  });

  it("offers an accessible form plus direct email, telephone and WhatsApp actions", () => {
    const component = readFileSync(
      join(process.cwd(), "components/prestudy/DirectContact.tsx"),
      "utf8",
    );
    expect(component).toContain("Formulario de contacto");
    expect(component).toContain('href="mailto:ofertas@montajedeprefabricados.com"');
    expect(component).toContain('href="tel:+34624473123"');
    expect(component).toContain("https://wa.me/34624473123");
    expect(component).toContain('fetch("/api/contact"');
  });
});
