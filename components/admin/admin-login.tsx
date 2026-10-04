"use client";
import {FormEvent, useState} from "react";
export function AdminLogin({configured}: {configured: boolean}) {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); const token = new FormData(event.currentTarget).get("token"); const response = await fetch("/api/admin/session", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({token})}); if (response.ok) window.location.reload(); else setError(configured ? "Clave incorrecta" : "Configura ADMIN_ACCESS_TOKEN para activar el panel"); }
  return <form onSubmit={submit} className="mx-auto mt-20 max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8"><p className="text-sm font-black uppercase tracking-widest text-yellow-400">Centro de operaciones</p><h1 className="mt-3 text-3xl font-black">Acceso administrativo</h1><label className="mt-8 block text-sm font-bold">Clave privada<input name="token" type="password" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-3" /></label><button className="mt-4 min-h-12 w-full rounded-xl bg-yellow-400 font-black text-neutral-950">Acceder</button>{error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}</form>;
}
