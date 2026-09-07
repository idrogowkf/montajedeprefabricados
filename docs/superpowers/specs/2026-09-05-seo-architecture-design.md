# Arquitectura SEO integral — Diseño

## Objetivo

Convertir la estructura V2.1 en una arquitectura rastreable, sin canibalización ni páginas puerta, alineada con la demanda real de montaje prefabricado en España.

## Evidencia de demanda

Google Trends España (últimos cinco años) muestra una demanda baja y fragmentada: `montaje de prefabricados` concentra más señal que sus variantes largas; `montaje de estructuras` y `grúas` presentan una base más estable; `lifting plan` y `plan de izado` son consultas poco frecuentes pero de intención técnica alta. La estrategia prioriza profundidad y consolidación sobre volumen artificial de URLs.

## Arquitectura

- `/`: pilar nacional para “montaje de prefabricados en España”.
- `/servicios/*`: intención transaccional y técnica por disciplina.
- `/tipos/*`: intención por aplicación constructiva.
- `/{ciudad}`: intención local, con condicionantes y contenido propios de cada área.
- `/presupuesto`: herramienta transaccional, fuera de la competencia editorial.
- `/servicios/montaje-prefabricado-hormigon`: redirección permanente a `/servicios/montaje-prefabricados` para consolidar señales.

## Requisitos técnicos

Cada URL indexable tendrá title y description únicos, canonical autorreferente, Open Graph, Twitter Card, breadcrumbs visibles, enlaces internos contextuales y JSON-LD coherente con el contenido visible. El sitemap se generará desde las mismas fuentes de datos. `robots.txt` permitirá rastreo y declarará host y sitemap. No se inventarán clientes, obras, certificaciones, disponibilidad, capacidades o experiencia.

## Calidad

Las pruebas impedirán títulos/canonicals duplicados, rutas de sitemap huérfanas, schemas inválidos y la reaparición de afirmaciones no demostrables. La validación final cubrirá tests, TypeScript, build, HTML generado y enlaces internos.
