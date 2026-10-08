import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("branded administrator access",()=>{
  const page=readFileSync(join(process.cwd(),"app/acceso-administracion/[[...sign-in]]/page.tsx"),"utf8");
  const css=readFileSync(join(process.cwd(),"app/acceso-administracion/access.css"),"utf8");
  it("keeps the login inside the Montaje de Prefabricados identity",()=>{
    for(const text of ["Acceso de administración","Montaje de Prefabricados","Correo y contraseña","SignIn"]){expect(page).toContain(text);}
    expect(page).toContain('fallbackRedirectUrl="/administracion"');
    expect(css).toContain("#ef233c");
  });
  it("does not expose Google access or public registration",()=>{
    expect(page).toContain("socialButtons");
    expect(page).toContain("footerAction");
    expect(page).not.toContain("SignUp");
  });
});
