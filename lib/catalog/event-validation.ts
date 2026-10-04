import {catalogProducts} from "./products";
import type {CatalogEvent} from "./types";

export function parseMetricEvent(input: unknown): CatalogEvent {
  if (!input || typeof input !== "object") throw new Error("Evento no válido");
  const {type, productSlug} = input as Record<string, unknown>;
  if (!(["product_view", "cart_add", "rfq_submitted"] as unknown[]).includes(type)) throw new Error("Evento no válido");
  if (typeof productSlug !== "string" || !catalogProducts.some((product) => product.slug === productSlug)) throw new Error("Producto no válido");
  return {type, productSlug} as CatalogEvent;
}

export function recordMetric(event: CatalogEvent) {
  if (typeof window === "undefined") return;
  void fetch("/api/metricas", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(event), keepalive: true}).catch(() => undefined);
}
