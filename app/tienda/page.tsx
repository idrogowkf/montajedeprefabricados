import type {Metadata} from "next";
import Link from "next/link";
import {CatalogBrowser} from "@/components/shop/catalog-browser";
import {catalogProducts} from "@/lib/catalog/products";

export const metadata: Metadata = {title: "Catálogo profesional | Montaje de Prefabricados", description: "Consumibles, EPI y herramientas para montaje. Solicita precio y disponibilidad sin compromiso."};

export default function ShopPage() {
  return <main className="min-h-screen bg-neutral-950 pb-32 text-white">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="font-black tracking-wide text-yellow-400">MP · SUMINISTROS</Link><Link href="/solicitar-oferta" className="text-sm font-bold">Mi solicitud</Link></div></header>
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-20">
      <div className="mb-10 max-w-3xl"><span className="text-sm font-black uppercase tracking-[.2em] text-yellow-400">Suministro bajo pedido</span><h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Catálogo profesional de alta rotación</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">Consumibles, protección y herramienta habitual para obra y montaje. Preparamos una oferta real con precio, disponibilidad, documentación y portes.</p><p className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-100">La cesta genera una solicitud no vinculante. No es un pedido ni reserva existencias.</p></div>
      <CatalogBrowser products={catalogProducts} />
    </section>
  </main>;
}
