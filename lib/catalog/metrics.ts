import type {CatalogEvent} from "./types";

export function calculateCatalogSummary(events: CatalogEvent[]) {
  const views = events.filter((event) => event.type === "product_view").length;
  const cartAdds = events.filter((event) => event.type === "cart_add").length;
  const rfqs = events.filter((event) => event.type === "rfq_submitted").length;
  return {views, cartAdds, rfqs, viewToRfqRate: views ? Math.round((rfqs / views) * 100) : 0};
}
