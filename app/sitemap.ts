import { MetadataRoute } from "next";

import { allSeoPages } from "../data/seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.montajedeprefabricados.com";

  return [
    { url: `${base}/`, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/presupuesto`, changeFrequency: "monthly" as const, priority: 0.8 },
    ...allSeoPages.map((page) => ({
      url: `${base}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: page.path === "/servicios/lifting-plan" ? 0.9 : page.kind === "service" ? 0.85 : page.kind === "type" ? 0.8 : 0.7,
    })),
  ];
}
