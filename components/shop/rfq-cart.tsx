"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import type {CatalogProduct} from "@/lib/catalog/types";
import {recordMetric} from "@/lib/catalog/event-validation";

export const CART_KEY = "mp-rfq-cart";
export type CartLine = Pick<CatalogProduct, "slug" | "name" | "unit"> & {quantity: number};

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function addCartLine(product: CatalogProduct) {
  const cart = readCart();
  const existing = cart.find((line) => line.slug === product.slug);
  if (existing) existing.quantity = Math.min(999, existing.quantity + 1);
  else cart.push({slug: product.slug, name: product.name, unit: product.unit, quantity: 1});
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  recordMetric({type: "cart_add", productSlug: product.slug});
  window.dispatchEvent(new Event("mp-cart-change"));
}

export function RfqCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const refresh = () => setLines(readCart());
    refresh();
    window.addEventListener("mp-cart-change", refresh);
    return () => window.removeEventListener("mp-cart-change", refresh);
  }, []);
  if (!lines.length) return null;
  const units = lines.reduce((total, line) => total + line.quantity, 0);
  return <aside aria-label="Cesta de solicitud" className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-yellow-400/40 bg-neutral-950/95 px-5 py-4 shadow-2xl backdrop-blur">
    <div><strong className="block text-sm text-white">Solicitud en preparación</strong><span className="text-xs text-neutral-400">{units} {units === 1 ? "unidad" : "unidades"} · sin compromiso</span></div>
    <Link href="/solicitar-oferta" className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-neutral-950">Revisar solicitud</Link>
  </aside>;
}
