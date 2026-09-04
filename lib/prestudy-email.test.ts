import { describe, expect, it } from "vitest";
import { initialPreStudyData } from "./prestudy";
import { renderAdminPreStudyEmail, renderClientPreStudyEmail } from "./prestudy-email";

const data = {...initialPreStudyData,projectType:"Nave industrial",location:"Madrid",date:"2026-10-20",name:"Luis <script>",company:"Iberia",phone:"+34 600 000 000",email:"cliente@example.com",needs:["Montaje","Grúa"],pieces:"24",message:"Revisar accesos"};

describe("pre-study email templates", () => {
  it("renders a branded and complete administrative email", () => {
    const email = renderAdminPreStudyEmail(data,"MP-2026-ABC123");
    expect(email.html).toContain("MONTAJE PREFABRICADO");
    expect(email.html).toContain("MP-2026-ABC123");
    expect(email.html).toContain("Nave industrial");
    expect(email.html).toContain("+34 624 473 123");
    expect(email.html).not.toContain("<script>");
    expect(email.text).toContain("Revisar accesos");
  });

  it("returns the project summary and contact routes to the client", () => {
    const email = renderClientPreStudyEmail(data,"MP-2026-ABC123");
    expect(email.html).toContain("24");
    expect(email.html).toContain("cliente@example.com");
    expect(email.html).toContain("wa.me/34624473123");
    expect(email.text).toContain("MP-2026-ABC123");
  });
});
