import {createHash, timingSafeEqual} from "node:crypto";

export const ADMIN_COOKIE = "mp_admin";
export function adminCookieValue(token: string) { return createHash("sha256").update(`mp-admin:${token}`).digest("hex"); }
export function isAdminAuthorized(cookie: string | undefined, token = process.env.ADMIN_ACCESS_TOKEN) {
  if (!cookie || !token || token.length < 24) return false;
  const expected = adminCookieValue(token);
  const left = Buffer.from(cookie), right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
