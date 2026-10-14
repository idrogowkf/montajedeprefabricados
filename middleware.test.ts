import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

describe("administration authentication routing",()=>{
  it("keeps unauthenticated visitors inside the branded sign-in page",()=>{
    const source=readFileSync(join(process.cwd(),"middleware.ts"),"utf8");
    expect(source).toContain('new URL("/acceso-administracion",request.url)');
    expect(source).toContain('signInUrl.searchParams.set("redirect_url",request.url)');
  });
});
