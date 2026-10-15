// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { jsonLdOrganization, jsonLdWebSite } from "@/lib/seo";
import FloatingContactActions from "@/components/v21/FloatingContactActions";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.montajedeprefabricados.com"),
    title: {
        default: "Montaje de Prefabricados en España | Grúas, Estructuras, Ingeniería",
        template: "%s | Montaje de Prefabricados",
    },
    description:
        "Planificación de montaje de prefabricados de hormigón: ingeniería, planes de izado, grúas, logística, secuencia y documentación técnica en España.",
    alternates: {
        canonical: "https://www.montajedeprefabricados.com",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: { type: "website", locale: "es_ES", siteName: "Montaje de Prefabricados", images: [{ url: "/og.png", alt: "Montaje de prefabricados" }] },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
    icons: {
        icon: "/favicon.svg",
    },
    manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
    themeColor: "#070707",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdOrganization()),
                    }}
                />
                <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite()) }} />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </head>
            <body className="bg-neutral-950 text-neutral-200">{children}<FloatingContactActions /></body>
        </html>
    );
}
