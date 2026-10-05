# Catálogo y administración comercial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el prototipo en un catálogo B2B amplio y una administración local que calcule precios, márgenes y beneficios sin confundir datos provisionales con ofertas reales.

**Architecture:** Un único dominio de productos alimenta tienda, portada y administración. El precio se deriva de coste, transporte, comisión, contingencia y margen objetivo; la administración edita esos valores localmente y la tienda solo muestra referencias publicables. Los flujos de correo y proveedor se representan como estados operativos hasta conectar persistencia, autenticación y APIs.

**Tech Stack:** Next.js 14, React 18, TypeScript, Vitest, CSS.

**Spec:** Solicitud del usuario del 5 de octubre de 2026 en este chat.

## Global Constraints

- No desplegar ni modificar producción.
- No presentar costes, disponibilidad, certificaciones o acuerdos de proveedor como confirmados si no lo están.
- Mostrar precios con IVA separado y conservar trazabilidad del cálculo interno.
- Separar alta rotación de productos configurables o sujetos a validación técnica.
- Administración no indexable y claramente marcada como local hasta implementar autenticación.

## Review Focus

- Margen calculado sobre venta, no simple recargo sobre coste.
- IVA no contado como beneficio.
- Productos críticos sujetos a configuración no permiten compra directa engañosa.
- Cambios administrativos persisten tras recargar en el navegador local.
- Catálogo móvil mantiene búsqueda, filtros y carrito utilizables.

---

### Task 1: Dominio de catálogo y motor de precios

**Files:** Create `data/catalog.ts`, `lib/pricing.ts`, tests correspondientes.

- [ ] Escribir pruebas fallidas de cálculo y clasificación.
- [ ] Implementar tipos, 24 referencias iniciales y cálculo de precio/margen.
- [ ] Ejecutar pruebas y confirmar verde.

### Task 2: Catálogo público multifacético

**Files:** Modify `components/store/MarketplaceMockup.tsx`, `app/tienda/tienda.css`, `components/v21/StoreDiscovery.tsx`.

- [ ] Escribir prueba fallida para filtros por familia y material.
- [ ] Sustituir datos demo mínimos por dominio compartido y añadir filtros de seguridad, hormigón, acero, madera/PVC y sellado.
- [ ] Verificar búsqueda, detalle y carrito en navegador.

### Task 3: Administración comercial local

**Files:** Create `app/administracion/*`, `components/admin/*`.

- [ ] Escribir prueba fallida de composición y reglas de edición.
- [ ] Implementar resumen, tabla editable, ficha económica, proveedores y bandeja operativa.
- [ ] Verificar edición, recálculo y persistencia local.

### Task 4: Verificación y punto de recuperación

- [ ] Ejecutar suite completa, typecheck y comprobación visual.
- [ ] Confirmar que no existen errores de consola.
- [ ] Crear commit sin publicar ni desplegar.
