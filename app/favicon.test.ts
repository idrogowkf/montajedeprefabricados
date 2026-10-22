import {existsSync,readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

describe("Google-compatible favicon",()=>{
  it("publishes the current brand in supported raster formats",()=>{
    const layout=readFileSync(join(process.cwd(),"app/layout.tsx"),"utf8");
    expect(layout).toContain("/favicon-96x96.png");
    expect(layout).toContain("/favicon.ico");
    expect(layout).not.toContain('href="/favicon.svg"');
    for(const file of ["favicon.ico","favicon-48x48.png","favicon-96x96.png","apple-touch-icon.png"]){
      expect(existsSync(join(process.cwd(),"public",file))).toBe(true);
    }
  });
});
