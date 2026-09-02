import {describe,expect,it} from "vitest";
import {estimateAssembly} from "./estimate";
describe("estimateAssembly",()=>{it("parses decimal tonnages and applies the night factor",()=>{expect(estimateAssembly({tonelajes:"10T, 20T",radios:"22m",plazo:"2 noches"})).toMatchObject({avg_tonelaje:15,radio_max:22,factor_urgencia:1.25})});it("uses safe defaults for empty data",()=>{expect(estimateAssembly({})).toMatchObject({avg_tonelaje:30,radio_max:18,factor_urgencia:1})})});
