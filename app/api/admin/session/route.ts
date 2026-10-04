import {NextResponse} from "next/server";
import {ADMIN_COOKIE, adminCookieValue} from "@/lib/admin/auth";

export async function POST(request: Request) {
  const {token} = await request.json() as {token?: string};
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!token || !expected || token !== expected || expected.length < 24) return NextResponse.json({ok: false, error: "Acceso no válido"}, {status: 401});
  const response = NextResponse.json({ok: true});
  response.cookies.set(ADMIN_COOKIE, adminCookieValue(expected), {httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/administracion", maxAge: 60 * 60 * 8});
  return response;
}
