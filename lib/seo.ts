import type { Metadata } from 'next'
import type { SeoPage } from '../data/seo-pages'

export const site = {
  name: 'Montaje de Prefabricados',
  url: 'https://www.montajedeprefabricados.com',
  description:
    'Planificación de montaje de prefabricados en España: ingeniería de montaje, planes de izado, grúas, logística, secuencia y documentación técnica.',
}

export const defaultMetadata: Metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: 'website',
    url: site.url,
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
  },
}

export function createPageMetadata(page: SeoPage): Metadata {
  const canonical = `${site.url}${page.path}`
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      url: canonical,
      siteName: site.name,
      locale: 'es_ES',
      images: [{ url: page.image, alt: page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [page.image],
    },
    robots: { index: true, follow: true },
  }
}

export function buildPageSchemas(page: SeoPage): Record<string, unknown>[] {
  const url = `${site.url}${page.path}`
  const category = page.kind === 'location' ? 'Ubicaciones' : page.kind === 'type' ? 'Tipologías' : 'Servicios'
  return [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: page.h1, description: page.description, url, inLanguage: 'es-ES', isPartOf: { '@type': 'WebSite', name: site.name, url: site.url } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: site.url },
      { '@type': 'ListItem', position: 2, name: category, item: `${site.url}/#${page.kind === 'type' ? 'proyectos' : 'capacidades'}` },
      { '@type': 'ListItem', position: 3, name: page.h1, item: url },
    ] },
    { '@context': 'https://schema.org', '@type': 'Service', name: page.h1, description: page.description, url, serviceType: page.primaryQuery, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: page.areaServed ? { '@type': 'City', name: page.areaServed } : { '@type': 'Country', name: 'España' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
  ]
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": site.name,
    "url": site.url,
    "email": "ofertas@montajedeprefabricados.com",
    "telephone": "+34624473123",
    "areaServed": { "@type": "Country", "name": "España" },
    "contactPoint": { "@type": "ContactPoint", "contactType": "presupuestos", "telephone": "+34624473123", "email": "ofertas@montajedeprefabricados.com", "availableLanguage": ["es"] }
  }
}

export function jsonLdWebSite() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, inLanguage: 'es-ES' }
}
