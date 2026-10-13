# Catálogo de hormigón, elevación y seguridad Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generar un único PDF de aprobación con al menos 420 referencias verificadas, centradas en hormigón, elevación/manipulación, trabajos en altura y EPI, con toda la información comercial en español.

**Architecture:** Un inventario nuevo e independiente conservará la selección, las traducciones y la evidencia de origen. Recolectores por fabricante normalizarán fuentes oficiales, un validador bloqueará referencias incompletas o duplicadas y un generador ReportLab producirá el PDF sin modificar el catálogo público.

**Tech Stack:** TypeScript/Node para recolección y validación; Python, ReportLab, Pillow, pypdf y Poppler para recursos, generación y control visual.

**Spec:** `docs/superpowers/specs/2026-10-13-catalogo-prefabricado-hormigon-elevacion-seguridad-design.md`

## Global Constraints

- Mínimo 120 referencias de accesorios para hormigón, 60 de elevación/manipulación, 120 de trabajos en altura y 120 de EPI.
- Prioridad acreditada: fabricación española, después alemana y finalmente otros países europeos cuando sea necesario.
- Todo el contenido visible estará en español; solo el PDF técnico podrá permanecer en inglés.
- Cada referencia tendrá fabricante, código real, aplicación, imagen, enlace oficial y PDF técnico válido.
- No modificar ni desplegar el catálogo público durante esta fase.

## Review Focus

- Un distribuidor español no debe confundirse con un fabricante español; el origen requiere evidencia oficial.
- Las variantes de capacidad deben corresponder a códigos comerciales reales y no a duplicados artificiales.
- Los equipos de gran tonelaje deben mostrar la capacidad documentada y no una inferencia por semejanza.
- Las traducciones deben conservar la terminología técnica y dejar intactas marcas y referencias.
- Los PDF compartidos por una familia solo son válidos si identifican claramente todos los modelos asociados.

---

### Task 1: Contrato y validación del inventario especializado

**Files:**
- Create: `research/catalog-specialized/schema.ts`
- Create: `research/catalog-specialized/validate.ts`
- Test: `research/catalog-specialized/validate.test.ts`

**Interfaces:**
- Produces: `SpecializedProduct`, `SpecializedSection`, `validateSpecializedCatalog(products)`.

- [ ] Escribir pruebas para cupos mínimos, unicidad, campos españoles, capacidad, evidencia de origen, firma PDF e imagen.
- [ ] Ejecutar las pruebas y confirmar que fallan.
- [ ] Implementar el contrato y el validador mínimo.
- [ ] Ejecutar las pruebas y confirmar que pasan.
- [ ] Commit.

### Task 2: Recolectores españoles y alemanes

**Files:**
- Create: `research/catalog-specialized/sources/spanish.ts`
- Create: `research/catalog-specialized/sources/german.ts`
- Create: `research/catalog-specialized/collect.ts`
- Test: `research/catalog-specialized/collect.test.ts`

**Interfaces:**
- Consumes: `SpecializedProduct`.
- Produces: candidatos normalizados con fuente, origen y documentación.

- [ ] Escribir pruebas con muestras oficiales de fabricantes españoles y alemanes.
- [ ] Confirmar el fallo inicial.
- [ ] Implementar extractores para páginas, imágenes, referencias, capacidades y documentos.
- [ ] Comprobar que el país de fabricación procede de evidencia oficial y no de la ubicación del distribuidor.
- [ ] Ejecutar las pruebas y confirmar que pasan.
- [ ] Commit.

### Task 3: Selección funcional y traducción española

**Files:**
- Create: `research/catalog-specialized/normalize.ts`
- Create: `research/catalog-specialized/catalog.json`
- Test: `research/catalog-specialized/normalize.test.ts`

**Interfaces:**
- Consumes: candidatos de Task 2 y referencias reutilizables verificadas del catálogo anterior.
- Produces: inventario final con mínimo 420 registros.

- [ ] Escribir pruebas de traducción, nomenclatura, familias, capacidades y prohibición de texto visible en inglés.
- [ ] Confirmar el fallo inicial.
- [ ] Normalizar nombres y descripciones al español sin alterar marcas ni códigos.
- [ ] Seleccionar 120 hormigón, al menos 60 elevación, 120 altura y 120 EPI, sin duplicados.
- [ ] Revisar la cobertura de placa alveolar, arquetas, tubos, paneles, doble T, cajón y cargas de 20 a 100 toneladas.
- [ ] Ejecutar la validación completa y confirmar todos los cupos.
- [ ] Commit.

### Task 4: Descarga y verificación de recursos

**Files:**
- Create: `research/catalog-specialized/download-assets.ts`
- Create: `research/catalog-specialized/assets-manifest.json`
- Test: `research/catalog-specialized/download-assets.test.ts`

**Interfaces:**
- Consumes: `catalog.json`.
- Produces: miniaturas locales y manifiesto de integridad.

- [ ] Escribir pruebas de firma PDF, MIME de imagen, tamaño y correspondencia.
- [ ] Confirmar el fallo inicial.
- [ ] Implementar descarga con caché, reintentos, límites y conversión de miniaturas.
- [ ] Verificar todos los recursos y eliminar referencias con documentación no válida.
- [ ] Reponer cualquier baja sin reducir los cupos aprobados.
- [ ] Commit del código y manifiesto, excluyendo temporales.

### Task 5: PDF único de aprobación

**Files:**
- Create: `research/catalog-specialized/render_catalog.py`
- Create: `research/catalog-specialized/test_render_catalog.py`
- Create: `output/pdf/catalogo-aprobacion-hormigon-elevacion-seguridad.pdf`

**Interfaces:**
- Consumes: inventario y manifiesto verificados.
- Produces: un único PDF final con todas las fichas y enlaces clicables.

- [ ] Escribir pruebas de portada, secciones, número de fichas, idioma y enlaces.
- [ ] Confirmar el fallo inicial.
- [ ] Implementar portada, índice, separadores, tarjetas y pies de página con la identidad visual existente.
- [ ] Generar el PDF único.
- [ ] Ejecutar pruebas estructurales y confirmar que pasan.

### Task 6: Control visual y entrega

**Files:**
- Create: `tmp/pdfs/catalog-specialized/rendered/*.png`
- Modify: `output/pdf/catalogo-aprobacion-hormigon-elevacion-seguridad.pdf` si la revisión detecta defectos.

**Interfaces:**
- Consumes: PDF generado.
- Produces: artefacto final visualmente revisado.

- [ ] Renderizar todas las páginas con Poppler.
- [ ] Detectar páginas vacías, dimensiones inesperadas y posibles desbordamientos.
- [ ] Inspeccionar portada, separadores, primera y última página de cada sección y una muestra sistemática intermedia.
- [ ] Corregir y regenerar hasta eliminar defectos.
- [ ] Reabrir con pypdf y comprobar páginas, texto español, enlaces y ausencia de archivos corruptos.
- [ ] Ejecutar la suite completa del proyecto y entregar el único PDF sin desplegar la tienda.
