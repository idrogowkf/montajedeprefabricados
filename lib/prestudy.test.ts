import { describe,expect,it } from "vitest";
import { initialPreStudyData,sanitizeFileName,validateFiles,validateStep } from "./prestudy";

describe("pre-study validation",() => {
  it("requires only the progressive minimum",() => {
    expect(validateStep(1,initialPreStudyData)).toHaveProperty("projectType");
    expect(validateStep(2,initialPreStudyData)).toEqual({});
    expect(validateStep(3,initialPreStudyData)).toHaveProperty("location");
  });
  it("treats missing fields as empty values at the API boundary",() => {
    expect(() => validateStep(6,{} as typeof initialPreStudyData)).not.toThrow();
    expect(validateStep(6,{} as typeof initialPreStudyData)).toHaveProperty("name");
  });
  it("accepts phone instead of email at contact",() => {
    const data = {...initialPreStudyData,name:"Ana",phone:"600000000"};
    expect(validateStep(6,data)).toEqual({});
  });
  it("rejects excessive or unsupported documentation",() => {
    const oversized = new File([new Uint8Array(25 * 1024 * 1024 + 1)],"plano.pdf");
    expect(validateFiles([oversized])).toMatch(/25 MB/);
    expect(validateFiles([new File(["x"],"script.exe")])).toMatch(/no está permitido/);
  });
  it("sanitizes upload path names while preserving the extension",() => {
    expect(sanitizeFileName("plano estructura <final>.DWG")).toBe("plano-estructura--final-.dwg");
  });
});
