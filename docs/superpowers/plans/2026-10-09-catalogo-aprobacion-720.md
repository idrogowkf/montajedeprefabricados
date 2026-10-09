# Catálogo de aprobación de 720 productos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generar un PDF verificado con 720 productos reales, 120 por cada una de seis secciones, sin publicarlos en la tienda.

**Architecture:** Un inventario JSON normalizado conserva evidencia y estado de verificación; recolectores por fabricante convierten páginas y catálogos oficiales a ese contrato. Un validador bloquea duplicados, enlaces rotos o cupos incompletos y un generador ReportLab produce el PDF final con recursos locales optimizados.

**Tech Stack:** TypeScript/Node para normalización y comprobación HTTP; Python, ReportLab, Pillow, pypdf y Poppler para generación y QA visual.

**Spec:** `docs/superpowers/specs/2026-10-09-catalogo-aprobacion-720-design.md`

## Global Constraints

- Exactamente 120 referencias únicas en hormigón, acero, madera, PVC, trabajos en altura y EPI.
- Solo referencias reales con fabricante, código, producto, imagen y PDF técnico comprobables.
- No modificar ni publicar el catálogo de la tienda durante esta fase.
- PDF A4 apaisado, cuatro fichas por página, identidad negra, blanca y roja.

## Review Focus

- Un mismo modelo no puede inflar dos secciones: el validador rechaza ids y pares fabricante-referencia duplicados.
- Una página HTML no puede pasar como PDF: se verifica content-type y firma `%PDF`.
- Las redirecciones o recursos retirados deben marcar la referencia como no apta.
- Una imagen de marcador, logotipo o variante distinta debe quedar fuera mediante revisión de concordancia.
- El texto largo no debe invadir otra ficha: se limita y se prueba el cuadro de cada campo.

---

### Task 1: Contrato del inventario y validador

**Files:**
- Create: `research/catalog-approval/schema.ts`
- Create: `research/catalog-approval/validate.ts`
- Test: `research/catalog-approval/validate.test.ts`

**Interfaces:**
- Produces: `ApprovalProduct`, `ApprovalSection`, `validateApprovalCatalog(products)`.

- [ ] Escribir pruebas de cupos, unicidad, campos obligatorios, PDF real e imagen verificada.
- [ ] Ejecutar las pruebas y confirmar que fallan.
- [ ] Implementar contrato y validador mínimo.
- [ ] Ejecutar las pruebas y confirmar que pasan.
- [ ] Commit.

### Task 2: Recolectores y normalización

**Files:**
- Create: `research/catalog-approval/sources/*.ts`
- Create: `research/catalog-approval/collect.ts`
- Create: `research/catalog-approval/catalog.json`
- Test: `research/catalog-approval/collect.test.ts`

**Interfaces:**
- Consumes: `ApprovalProduct`.
- Produces: inventario deduplicado con evidencia primaria y estado HTTP.

- [ ] Escribir pruebas con muestras de páginas y catálogos oficiales.
- [ ] Ejecutarlas y confirmar que fallan.
- [ ] Implementar extractores por patrón de fabricante y comprobación de recursos.
- [ ] Recolectar, normalizar y revisar los 720 registros.
- [ ] Ejecutar validación completa y confirmar 120 por sección.
- [ ] Commit.

### Task 3: Descarga y optimización de recursos

**Files:**
- Create: `research/catalog-approval/download-assets.ts`
- Create: `tmp/pdfs/catalog-approval/assets/`
- Test: `research/catalog-approval/download-assets.test.ts`

**Interfaces:**
- Consumes: `catalog.json`.
- Produces: imágenes locales optimizadas y manifiesto de integridad.

- [ ] Escribir pruebas de tipo MIME, firma, tamaño y correspondencia de archivo.
- [ ] Ejecutarlas y confirmar que fallan.
- [ ] Implementar descarga con caché, límites, reintentos y conversión de miniaturas.
- [ ] Descargar y verificar los recursos.
- [ ] Commit solo de código y manifiesto; excluir temporales.

### Task 4: Generador del PDF

**Files:**
- Create: `research/catalog-approval/render_catalog.py`
- Create: `output/pdf/catalogo-aprobacion-montaje-prefabricado.pdf`
- Test: `research/catalog-approval/test_render_catalog.py`

**Interfaces:**
- Consumes: inventario y manifiesto de recursos.
- Produces: PDF final con 720 fichas y enlaces clicables.

- [ ] Escribir pruebas de portada, seis secciones, 720 fichas, enlaces y paginación.
- [ ] Ejecutarlas y confirmar que fallan.
- [ ] Implementar componentes de portada, separador, tarjeta y pie.
- [ ] Generar el PDF.
- [ ] Ejecutar pruebas estructurales y confirmar que pasan.

### Task 5: Revisión visual y entrega

**Files:**
- Create: `tmp/pdfs/catalog-approval/rendered/*.png`
- Modify: `output/pdf/catalogo-aprobacion-montaje-prefabricado.pdf` si la revisión detecta defectos.

**Interfaces:**
- Consumes: PDF final.
- Produces: artefacto visualmente verificado.

- [ ] Renderizar todas las páginas con Poppler.
- [ ] Inspeccionar transiciones, muestra sistemática y detección automática de páginas vacías o desbordadas.
- [ ] Corregir y regenerar hasta eliminar defectos.
- [ ] Reabrir con pypdf, comprobar páginas, texto, enlaces y ausencia de archivos corruptos.
- [ ] Entregar el PDF sin modificar producción.
