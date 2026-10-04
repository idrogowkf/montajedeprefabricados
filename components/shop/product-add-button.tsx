"use client";
import type {CatalogProduct} from "@/lib/catalog/types";
import {addCartLine} from "./rfq-cart";
export function ProductAddButton({product}: {product: CatalogProduct}) { return <button onClick={() => addCartLine(product)} className="mt-8 min-h-14 w-full rounded-xl bg-yellow-400 px-5 font-black text-neutral-950 sm:w-auto">Añadir a solicitud</button>; }
