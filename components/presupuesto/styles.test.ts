import { describe, expect, it } from "vitest";
import { parseDecimal } from "./styles";

describe("parseDecimal", () => {
  it.each([
    ["12,5", 12.5],
    ["12.5", 12.5],
    ["", 0],
    [",", 0],
    ["invalid", 0],
  ])("parses %s as %s", (input, expected) => {
    expect(parseDecimal(input)).toBe(expected);
  });
});
