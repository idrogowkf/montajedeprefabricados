# Catálogo público de 80 referencias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar un catálogo de unas 80 referencias reales sin exponer datos comerciales internos.

**Architecture:** Separar presentación pública y modelo administrativo mediante selectores públicos derivados. Dividir el catálogo por familias en archivos de datos auditables y conservar Neon como fuente de parámetros comerciales editables.

**Tech Stack:** Next.js 14, React, TypeScript, Neon, Vitest, Vercel Preview.

**Spec:** `docs/superpowers/specs/2026-10-06-catalogo-publico-80-referencias-design.md`

## Global Constraints

- Producción no se modifica.
- Datos internos solo en administración.
- IVA público predeterminado: 21 %.
- Productos configurables: `Solicitar oferta`, sin precio inventado.
- Ningún producto público sin referencia identificable e imagen.

## Review Focus

- El HTML público no contiene nombres de competidores, coste, margen ni rotación.
- Una referencia configurable nunca habilita compra directa.
- Precio neto, IVA y total coinciden con la calculadora comercial.
- Los filtros siguen funcionando con 80 referencias.
- Las imágenes rotas no se consideran publicables.

---

### Task 1: Frontera público/administración

**Files:**
- Modify: `components/store/MarketplaceMockup.tsx`
- Modify: `app/tienda/tienda.css`
- Test: `components/store/marketplace-filters.test.ts`

**Interfaces:**
- Consumes: `CatalogProduct`, `isPublicationReady`
- Produces: escaparate sin metadatos internos y detalle público con neto, IVA, total y transporte

- [x] Escribir pruebas que prohíban rotación, fuentes y margen en el componente público y exijan IVA/transporte.
- [x] Ejecutarlas y comprobar el fallo.
- [x] Implementar la presentación pública mínima.
- [x] Ejecutar pruebas y confirmar el pase.
- [x] Commit.

### Task 2: Catálogo auditado por familias

**Files:**
- Create: `data/catalog-lifting.ts`
- Create: `data/catalog-consumables.ts`
- Modify: `data/catalog.ts`
- Test: `data/catalog.test.ts`

**Interfaces:**
- Produces: `catalogProducts` con objetivo de 80 referencias identificadas, familias y modo `ready` o `quote`
- Consumes: tipos comerciales existentes

- [x] Escribir pruebas de cantidad, identidad, imágenes y reglas quote/ready.
- [x] Ejecutarlas y comprobar el fallo.
- [x] Incorporar referencias reales por familias, con fuente administrativa y modo de venta correcto.
- [x] Ejecutar pruebas y confirmar el pase.
- [x] Commit.

### Task 3: Administración y despliegue Preview

**Files:**
- Modify: `components/admin/CatalogAdmin.tsx`
- Modify: `components/admin/catalog-admin.test.ts`
- Modify: `lib/catalog-db.ts`

**Interfaces:**
- Consumes: catálogo ampliado y campos comerciales
- Produces: filtros administrativos y sincronización Neon sin filtrar datos al público

- [x] Escribir pruebas para filtros, comparadores y cálculos internos.
- [x] Ejecutarlas y comprobar el fallo.
- [x] Implementar filtros y sincronización.
- [x] Ejecutar suite, typecheck y build.
- [ ] Desplegar y verificar tienda/administración en Preview.
- [ ] Commit y push de la rama.
