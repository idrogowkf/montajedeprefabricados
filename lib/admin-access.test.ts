import {describe,expect,it} from "vitest";
import {isAdminIdentity} from "./admin-access";

describe("admin authorization",()=>{
  it("denies ordinary authenticated users",()=>expect(isAdminIdentity("user_customer",{},"user_owner")).toBe(false));
  it("allows an explicitly configured owner",()=>expect(isAdminIdentity("user_owner",{},"user_owner,user_backup")).toBe(true));
  it("allows an administrative Clerk claim",()=>expect(isAdminIdentity("user_admin",{metadata:{role:"admin"}},"")).toBe(true));
  it("fails closed without an identity",()=>expect(isAdminIdentity(null,{metadata:{role:"admin"}},"user_owner")).toBe(false));
});
