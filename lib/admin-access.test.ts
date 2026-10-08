import {describe,expect,it} from "vitest";
import {isAdminEmail,isAdminIdentity} from "./admin-access";

describe("admin authorization",()=>{
  it("denies ordinary authenticated users",()=>expect(isAdminIdentity("user_customer",{},"user_owner")).toBe(false));
  it("allows an explicitly configured owner",()=>expect(isAdminIdentity("user_owner",{},"user_owner,user_backup")).toBe(true));
  it("allows an administrative Clerk claim",()=>expect(isAdminIdentity("user_admin",{metadata:{role:"admin"}},"")).toBe(true));
  it("fails closed without an identity",()=>expect(isAdminIdentity(null,{metadata:{role:"admin"}},"user_owner")).toBe(false));
  it("allows only an explicitly configured administrative email",()=>{
    expect(isAdminEmail("ofertas@montajedeprefabricados.com","ofertas@montajedeprefabricados.com")).toBe(true);
    expect(isAdminEmail("otro@example.com","ofertas@montajedeprefabricados.com")).toBe(false);
  });
});
