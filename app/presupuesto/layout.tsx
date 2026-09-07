import type { Metadata } from "next";
import { site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Presupuesto técnico de montaje prefabricado",
  description: "Herramienta para estructurar piezas, dimensiones, radios, fechas y datos de contacto antes de solicitar un presupuesto de montaje prefabricado.",
  alternates: { canonical: `${site.url}/presupuesto` },
  openGraph: { title: "Presupuesto técnico de montaje prefabricado", description: "Organiza los datos iniciales de piezas, radios y calendario para solicitar una revisión técnica.", url: `${site.url}/presupuesto`, type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Presupuesto técnico de montaje prefabricado", description: "Organiza piezas, radios y calendario para solicitar una revisión técnica.", images: ["/og.png"] },
};

export default function PresupuestoLayout({ children }: { children: React.ReactNode }) {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "Presupuesto técnico de montaje prefabricado", url: `${site.url}/presupuesto`, description: metadata.description, inLanguage: "es-ES", isPartOf: { "@type": "WebSite", name: site.name, url: site.url } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</>;
}
