import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            }
        ],
        host: "https://www.montajedeprefabricados.com",
        sitemap: "https://www.montajedeprefabricados.com/sitemap.xml",
    };
}
