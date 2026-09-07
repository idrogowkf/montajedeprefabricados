import Landing from "@/components/landing-v21";
import type { Metadata } from "next";
import SeoJsonLd from "@/components/v21/SeoJsonLd";
import { homeFaqs } from "@/data/home-seo";
import { site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Montaje de prefabricados en España | Ingeniería e izado",
  description: "Planificación de montaje de prefabricados de hormigón en España: ingeniería de montaje, lifting plan, grúas, logística, secuencia y preestudio técnico.",
  alternates: { canonical: site.url },
  openGraph: { title: "Montaje de prefabricados en España", description: "Ingeniería, izado, logística y secuencia para preparar montajes prefabricados con información verificable.", url: site.url, type: "website", images: [{ url: "/og.png", alt: "Planificación de montaje de prefabricados" }] },
  twitter: { card: "summary_large_image", title: "Montaje de prefabricados en España", description: "Ingeniería, izado, logística y secuencia para preparar montajes prefabricados.", images: ["/og.png"] },
};

export default function Page() {
  const schemas: Record<string, unknown>[] = [
    { "@context": "https://schema.org", "@type": "WebPage", name: "Montaje de prefabricados en España", url: site.url, description: metadata.description, inLanguage: "es-ES" },
    { "@context": "https://schema.org", "@type": "Service", name: "Planificación de montaje de prefabricados", serviceType: "Montaje de prefabricados", provider: { "@type": "Organization", name: site.name, url: site.url }, areaServed: { "@type": "Country", name: "España" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map(faq=>({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];
  return <><SeoJsonLd schemas={schemas} /><Landing /></>;
}
