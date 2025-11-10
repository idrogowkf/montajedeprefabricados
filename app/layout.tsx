// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { defaultMetadata, jsonLdOrganization } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Montaje de Prefabricados",
    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization()) }}
                />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="text-neutral-200">
                {children}
            </body>
        </html>
    )
}
