import {cookies} from "next/headers";
import {ADMIN_COOKIE, isAdminAuthorized} from "@/lib/admin/auth";
import {AdminLogin} from "@/components/admin/admin-login";
import {OperationsDashboard} from "@/components/admin/operations-dashboard";

export const dynamic = "force-dynamic";
export const metadata = {title: "Centro de operaciones", robots: {index: false, follow: false}};

async function getRfqs() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/rfqs?select=id,reference,company_name,contact_name,email,status,created_at&order=created_at.desc&limit=50`, {headers: {apikey: key, Authorization: `Bearer ${key}`}, cache: "no-store"});
  if (!response.ok) return [];
  return response.json();
}

export default async function AdminPage() {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  const authorized = isAdminAuthorized(cookies().get(ADMIN_COOKIE)?.value, token);
  if (!authorized) return <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white"><AdminLogin configured={Boolean(token && token.length >= 24)} /></main>;
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const rfqs = await getRfqs();
  return <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white"><div className="mx-auto max-w-7xl"><p className="text-sm font-black uppercase tracking-[.2em] text-yellow-400">Montaje de Prefabricados</p><h1 className="mt-3 text-4xl font-black md:text-6xl">Centro de operaciones</h1><p className="mb-10 mt-4 text-neutral-400">Solicitudes, seguimiento y rendimiento comercial en un único lugar.</p><OperationsDashboard rfqs={rfqs} configured={configured} /></div></main>;
}
