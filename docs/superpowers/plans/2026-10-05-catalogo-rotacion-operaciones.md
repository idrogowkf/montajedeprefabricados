# Catálogo de rotación y operaciones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar un catálogo B2B móvil de alta rotación con cesta de solicitud, captura medible y panel interno, sin presentar presupuestos como pedidos ni depender del correo como fuente de verdad.

**Architecture:** Next.js App Router con catálogo semilla tipado y páginas renderizadas en servidor; la cesta vive temporalmente en el dispositivo hasta el envío. Las solicitudes pasan por una API validada y una capa de repositorio intercambiable, con esquema Supabase preparado y degradación explícita cuando faltan credenciales. El panel consume la misma capa de dominio y muestra el embudo operativo.

**Tech Stack:** Next.js 14, React 18, TypeScript, Vitest, Supabase REST/PostgreSQL preparado, Resend.

**Spec:** `docs/superpowers/specs/2026-10-04-catalogo-b2b-solicitud-oferta-design.md` y `docs/superpowers/specs/2026-10-04-rotacion-proveedores-operaciones-design.md`

## Global Constraints

- El flujo es B2B y no vinculante; no acepta pagos ni confirma disponibilidad.
- Ninguna ficha afirmará homologación, marcado CE, precio o stock sin respaldo.
- La administración y las cuentas deben quedar preparadas para protección, nunca exponer secretos al navegador.
- Debe funcionar en móvil y preservar la web pública existente.
- Las imágenes, textos y documentos de terceros requieren autorización; el piloto usa contenido propio sin imágenes ajenas.
- Los cambios ajenos ya presentes en el worktree no se modificarán ni se incluirán en commits de este plan.

## Review Focus

- Cantidades vacías, negativas o excesivas deben rechazarse sin perder la cesta.
- Una solicitud repetida con la misma clave debe producir un único expediente.
- La falta de correo no debe borrar ni invalidar una solicitud ya guardada.
- El panel no debe mostrar datos sensibles cuando la configuración administrativa no esté activa.
- Los productos retirados o bajo consulta no deben presentarse como disponibles para compra inmediata.

---

### Task 1: Dominio y catálogo piloto

**Files:**
- Create: `lib/catalog/types.ts`
- Create: `lib/catalog/products.ts`
- Create: `lib/catalog/catalog.test.ts`
- Create: `lib/catalog/metrics.ts`

**Interfaces:**
- Produces: `CatalogProduct`, `catalogProducts`, `getCatalogProduct(slug)`, `filterCatalogProducts(query, category)`, `calculateCatalogSummary(events)`.

- [ ] Escribir pruebas fallidas para catálogo único, filtros y cálculo del embudo.
- [ ] Ejecutar `npx vitest run lib/catalog/catalog.test.ts` y comprobar fallo por módulos ausentes.
- [ ] Implementar tipos, 48 referencias piloto, filtros y agregación mínima.
- [ ] Ejecutar la prueba y comprobar que pasa.
- [ ] Commit de los archivos de esta tarea.

### Task 2: Tienda móvil y cesta de solicitud

**Files:**
- Create: `app/tienda/page.tsx`
- Create: `app/tienda/[categoria]/page.tsx`
- Create: `app/tienda/producto/[slug]/page.tsx`
- Create: `components/shop/catalog-browser.tsx`
- Create: `components/shop/rfq-cart.tsx`
- Create: `components/shop/shop.test.ts`
- Modify: `app/globals.css`
- Modify: `components/landing/site-shell.tsx`

**Interfaces:**
- Consumes: catálogo de Task 1.
- Produces: rutas públicas, cesta persistida en `localStorage` únicamente como borrador no autoritativo y navegación a `/solicitar-oferta`.

- [ ] Escribir prueba fallida para textos no vinculantes, categorías y cesta accesible.
- [ ] Ejecutar la prueba y confirmar el fallo esperado.
- [ ] Implementar páginas, componentes y estilos móviles sin imágenes de proveedores.
- [ ] Ejecutar la prueba y la suite de componentes.
- [ ] Commit de los archivos de esta tarea.

### Task 3: Solicitud B2B durable-ready y notificaciones

**Files:**
- Create: `lib/rfq/types.ts`
- Create: `lib/rfq/validation.ts`
- Create: `lib/rfq/validation.test.ts`
- Create: `lib/rfq/repository.ts`
- Create: `lib/rfq/email.ts`
- Create: `app/api/solicitudes/route.ts`
- Create: `app/api/solicitudes/route.test.ts`
- Create: `app/solicitar-oferta/page.tsx`
- Create: `components/shop/rfq-form.tsx`
- Create: `supabase/migrations/202610050001_catalog_rfq.sql`
- Create: `.env.example`

**Interfaces:**
- Consumes: referencias de catálogo y cesta de Task 2.
- Produces: `parseRfqRequest`, `createRfq`, endpoint `POST /api/solicitudes`, número de expediente y formulario.

- [ ] Escribir pruebas fallidas de validación, idempotencia contractual y degradación del correo.
- [ ] Ejecutar las pruebas y confirmar los fallos esperados.
- [ ] Implementar validación, repositorio Supabase REST, esquema, API y correo posterior al guardado.
- [ ] Implementar formulario móvil y estados recuperables.
- [ ] Ejecutar pruebas específicas y suite completa.
- [ ] Commit de los archivos de esta tarea.

### Task 4: Centro de operaciones y métricas

**Files:**
- Create: `app/administracion/page.tsx`
- Create: `components/admin/operations-dashboard.tsx`
- Create: `components/admin/operations-dashboard.test.ts`
- Create: `app/api/metricas/route.ts`
- Create: `app/api/metricas/route.test.ts`

**Interfaces:**
- Consumes: `calculateCatalogSummary`, eventos y expedientes.
- Produces: panel protegido por configuración, KPIs, estados y endpoint de eventos.

- [ ] Escribir pruebas fallidas de KPIs, estados vacíos y rechazo sin configuración administrativa.
- [ ] Ejecutar pruebas y confirmar los fallos esperados.
- [ ] Implementar panel, carga segura y captura de eventos sin datos sensibles.
- [ ] Ejecutar pruebas específicas y suite completa.
- [ ] Commit de los archivos de esta tarea.

### Task 5: Integración, navegación y verificación

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `README.md`
- Test: todos los archivos de pruebas anteriores.

**Interfaces:**
- Consumes: todas las tareas.
- Produces: producto navegable, indexación pública correcta y guía de activación.

- [ ] Escribir o actualizar pruebas de metadatos para tienda pública y administración no indexable.
- [ ] Ejecutar la prueba y comprobar fallo esperado.
- [ ] Integrar navegación, sitemap, metadatos y documentación de activación.
- [ ] Ejecutar `npm test`, `npx tsc --noEmit` y `npm run build`.
- [ ] Realizar revisión final de rama y corregir solo hallazgos importantes con RED→GREEN.
- [ ] Commit final.
