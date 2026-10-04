import {catalogProducts} from "@/lib/catalog/products";
import type {RfqRequest} from "./types";

function text(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export function parseRfqRequest(value: unknown): RfqRequest {
  if (!value || typeof value !== "object") throw new Error("Solicitud no válida");
  const input = value as Record<string, unknown>;
  const companyName = text(input.companyName, 120), nif = text(input.nif, 24), contactName = text(input.contactName, 100), email = text(input.email, 160).toLowerCase();
  if (!companyName || !contactName || !email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Completa los datos obligatorios");
  const rawItems = Array.isArray(input.items) ? input.items : [];
  if (!rawItems.length) throw new Error("Añade al menos un producto");
  if (rawItems.length > 60) throw new Error("Demasiados productos en la solicitud");
  const validSlugs = new Set(catalogProducts.map(({slug}) => slug));
  const items = rawItems.map((raw) => {
    const item = raw as Record<string, unknown>;
    const slug = text(item.slug, 100), quantity = Number(item.quantity);
    if (!validSlugs.has(slug)) throw new Error("Producto no válido");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) throw new Error("Cantidad no válida");
    return {slug, quantity};
  });
  const idempotencyKey = text(input.idempotencyKey, 64);
  if (!/^[0-9a-f-]{36}$/i.test(idempotencyKey)) throw new Error("Identificador de solicitud no válido");
  return {companyName, nif, contactName, email, phone: text(input.phone, 40), deliveryLocation: text(input.deliveryLocation, 180), notes: text(input.notes, 2000), idempotencyKey, items};
}
