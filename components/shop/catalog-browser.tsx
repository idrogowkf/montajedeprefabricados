"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import {filterCatalogProducts} from "@/lib/catalog/products";
import type {CatalogCategory, CatalogProduct} from "@/lib/catalog/types";
import {addCartLine, RfqCart} from "./rfq-cart";

const filters: Array<{value: "todos" | CatalogCategory; label: string}> = [
  {value: "todos", label: "Todo"}, {value: "epi", label: "EPI"},
  {value: "corte-perforacion", label: "Corte"}, {value: "medicion-marcado", label: "Medición"},
  {value: "fijacion-sellado", label: "Fijación"}, {value: "amarre-elevacion", label: "Amarre"},
  {value: "mantenimiento", label: "Mantenimiento"},
];

export function CatalogBrowser({products, initialCategory = "todos"}: {products: CatalogProduct[]; initialCategory?: string}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const visible = useMemo(() => filterCatalogProducts(query, category).filter((item) => products.some((product) => product.slug === item.slug)), [query, category, products]);
  return <>
    <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[.03] p-4 lg:grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor="catalog-search">Buscar productos</label>
      <input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar guantes, discos, sellador…" className="min-h-12 rounded-xl border border-white/10 bg-neutral-950 px-4 text-white outline-none focus:border-yellow-400" />
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoría">
        {filters.map((filter) => <button key={filter.value} onClick={() => setCategory(filter.value)} className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold ${category === filter.value ? "bg-yellow-400 text-neutral-950" : "bg-white/5 text-neutral-300"}`}>{filter.label}</button>)}
      </div>
    </div>
    <p className="mb-5 text-sm text-neutral-400">{visible.length} referencias encontradas</p>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((product) => <article key={product.slug} className="flex min-h-72 flex-col rounded-3xl border border-white/10 bg-neutral-900 p-6">
        <div className="mb-5 flex items-center justify-between gap-3"><span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">{product.categoryLabel}</span><span className="text-xs text-neutral-500">{product.reference}</span></div>
        <h2 className="text-xl font-black text-white"><Link href={`/tienda/producto/${product.slug}`}>{product.name}</Link></h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-neutral-400">{product.summary}</p>
        <p className="mt-4 text-sm font-semibold text-yellow-300">Precio y disponibilidad bajo consulta</p>
        <button onClick={() => addCartLine(product)} className="mt-4 min-h-12 rounded-xl bg-white px-4 font-black text-neutral-950 hover:bg-yellow-400">Añadir a solicitud</button>
      </article>)}
    </div>
    {visible.length === 0 && <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-neutral-400">No encontramos esa referencia. Puedes describirla en la solicitud.</div>}
    <RfqCart />
  </>;
}
