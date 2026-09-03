// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { jsonLdOrganization } from "@/lib/seo";

export const metadata: Metadata = {
    metadataBase: new URL("https://montajesprefabricados.com"),
    title: {
        default: "Montaje de Prefabricados en España | Grúas, Estructuras, Ingeniería",
        template: "%s | Montaje de Prefabricados",
    },
    description:
        "Especialistas en montaje de prefabricados de hormigón, estructuras metálicas, puentes, naves industriales, fachadas y paneles. Servicio en toda España.",
    alternates: {
        canonical: "https://montajesprefabricados.com",
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/favicon.ico",
    },
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
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="bg-neutral-950 text-neutral-200">{children}</body>
        </html>
    );
}
