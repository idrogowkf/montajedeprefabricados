import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

describe("responsive layout safeguards",()=>{
  it("stacks capability rows without clipping their content on mobile",()=>{
    const css=readFileSync(join(process.cwd(),"app/v21-extra.css"),"utf8");
    expect(css).toContain("grid-template-columns:38px minmax(0,1fr) 46px");
    expect(css).toContain(".v21-home .service-desc{grid-column:2");
  });

  it("allows the administrator access columns to shrink below 376px",()=>{
    const css=readFileSync(join(process.cwd(),"app/acceso-administracion/access.css"),"utf8");
    expect(css).toContain("grid-template-columns:minmax(0,1fr)");
    expect(css).toContain(".access-brand{min-width:0");
    expect(css).toContain(".access-form{min-width:0");
  });
});
