import {describe, expect, it} from "vitest";
import {adminCookieValue, isAdminAuthorized} from "@/lib/admin/auth";

describe("operations access", () => {
  it("stays closed when admin configuration is missing", () => {
    expect(isAdminAuthorized(undefined, undefined)).toBe(false);
  });

  it("accepts only the derived secure cookie", () => {
    const token = "a-long-private-administration-token";
    expect(isAdminAuthorized(adminCookieValue(token), token)).toBe(true);
    expect(isAdminAuthorized("wrong", token)).toBe(false);
  });
});
