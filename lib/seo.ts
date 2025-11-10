import type { Metadata } from 'next'

export const site = {
  name: 'Montaje de Prefabricados',
  url: 'https://montajedeprefabricados.com',
  description:
    'Especialistas en montaje de prefabricados en España: grúas 80–500T+, transporte especial (Ibercarga), cuadrillas expertas, planteizado, planos y as-built.',
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

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": site.name,
    "url": site.url,
    "email": "ofertas@montajedeprefabricados.com"
  }
}
