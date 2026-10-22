import {describe,expect,it} from "vitest";
// @ts-expect-error Next configuration is intentionally authored as ESM JavaScript.
import nextConfig from "./next.config.mjs";

type HeaderRule={source:string;headers:{key:string;value:string}[]};

describe("production security headers",()=>{
  it("adds browser security headers to every route",async()=>{
    const rules=(await nextConfig.headers?.()) as HeaderRule[]|undefined;
    const headers=Object.fromEntries((rules?.find((rule:HeaderRule)=>rule.source==="/:path*")?.headers??[]).map((item:{key:string;value:string})=>[item.key.toLowerCase(),item.value]));
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  });
});
