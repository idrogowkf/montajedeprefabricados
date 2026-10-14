# Marketplace técnico y búsqueda asistida — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restaurar el catálogo multifamilia verificado, añadir búsqueda y filtros orientados a la necesidad del cliente y dar a la tienda presencia comercial clara en el landing, sin modificar producción.

**Architecture:** Una taxonomía única y tipada alimentará catálogo, índice de búsqueda, filtros facetados, selector técnico y administración. La búsqueda se resolverá localmente sobre el catálogo público mediante documentos normalizados y sinónimos explícitos; el estado se sincronizará con la URL. Los productos anteriores se recuperarán mediante una auditoría reproducible y solo los expedientes válidos pasarán al catálogo público.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Vitest, Neon Postgres, CSS modular por ruta, Vercel Preview.

**Spec:** `docs/superpowers/specs/2026-10-14-marketplace-buscador-categorias-design.md`

## Global Constraints

- Conservar las 60 referencias aprobadas de elevación, izaje y manipulación.
- Categorías principales por función; las marcas solo son atributos y filtros.
- No publicar registros sin fabricante, referencia, fuente oficial e imagen válida.
- No declarar compatibilidad de elevación sin datos suficientes de capacidad y geometría.
- Precio, proveedor de coste, margen y comparativas permanecen privados en administración.
- No añadir un motor externo de búsqueda en esta fase.
- Toda la implementación se publica primero en `codex/marketplace-hibrido`; producción no se modifica.
- Seguir TDD: prueba roja, implementación mínima, prueba verde y commit por tarea.

## Review Focus

- Consultas coloquiales con tildes, plural y sinónimos deben encontrar la aplicación correcta sin exigir una referencia.
- Combinaciones de filtros sin resultados deben explicar el bloqueo y permitir limpiar filtros sin perder la consulta.
- Parámetros URL desconocidos o antiguos deben ignorarse sin romper la tienda.
- Productos con atributos técnicos incompletos no deben aparecer como compatibles en el selector.
- Imágenes editoriales, personas, códigos QR, logotipos o enlaces PDF no directos deben impedir la publicación automática.

---

## File Map

- `data/catalog-taxonomy.ts`: categorías, subcategorías, facetas, sinónimos y etiquetas compartidas.
- `data/catalog-taxonomy.test.ts`: integridad y ausencia de categorías por marca.
- `data/catalog-search.ts`: índice normalizado, sugerencias, ranking, facetas y serialización URL.
- `data/catalog-search.test.ts`: búsqueda, sinónimos, filtros y parámetros inválidos.
- `data/catalog-recovery.ts`: selección y adaptación de semillas Hilti/Petzl/Kratos/3M verificadas.
- `data/catalog-recovery.test.ts`: expedientes, imágenes, documentos y categorías recuperadas.
- `data/catalog.ts`: composición final del catálogo y reglas de publicación.
- `data/public-catalog.ts`: proyección pública y API pura de búsqueda/filtros.
- `components/store/CatalogSearch.tsx`: buscador predictivo accesible.
- `components/store/CatalogFilters.tsx`: filtros facetados en escritorio y móvil.
- `components/store/TechnicalFinder.tsx`: selector progresivo orientado a la aplicación.
- `components/store/MarketplaceMockup.tsx`: orquestación de estado, URL, catálogo y paneles.
- `components/store/*.test.ts`: pruebas estructurales del cableado accesible; las reglas e interacciones de estado se prueban como funciones puras en `data/` y se completan con verificación de navegador.
- `app/tienda/tienda.css`: diseño responsive de búsqueda, filtros y selector.
- `components/v21/Hero.tsx`: buscador comercial y entradas a categorías.
- `components/v21/StoreDiscovery.tsx`: bloque comercial, destacados y accesos.
- `app/home-v21.css`: jerarquía visual de la tienda en el landing.
- `components/admin/CatalogAdmin.tsx`: filtros y edición con taxonomía compartida.
- `lib/catalog-db.ts`: migración versionada de las nuevas referencias.
- `scripts/catalog-recovery-audit.mjs`: auditoría reproducible de expedientes recuperados.

### Task 1: Taxonomía funcional compartida

**Files:**
- Create: `data/catalog-taxonomy.ts`
- Create: `data/catalog-taxonomy.test.ts`
- Modify: `data/catalog.ts`

**Interfaces:**
- Produces: `CatalogCategoryId`, `CatalogApplicationId`, `CatalogFacetKey`, `catalogCategories`, `catalogApplications`, `catalogSynonyms`, `isCatalogCategory(value)`.
- Consumes: `CatalogSegment` solo como compatibilidad de migración; la nueva taxonomía será la fuente principal.

- [ ] **Step 1: Escribir pruebas rojas de taxonomía**

Comprobar siete categorías funcionales, identificadores únicos, etiquetas españolas y que ninguna categoría se llame Hilti, Petzl, Kratos, 3M, WIMAG, Elebia o PFEIFER. Comprobar los sinónimos `pozo/arqueta/anillo/registro`, `elevar/izar/levantar/coger/manipular`, `taladrar/perforar` y `taco/anclaje/fijación/perno`.

- [ ] **Step 2: Verificar el fallo**

Run: `npx vitest run data/catalog-taxonomy.test.ts`
Expected: FAIL porque `data/catalog-taxonomy.ts` no existe.

- [ ] **Step 3: Implementar las interfaces de taxonomía**

Crear categorías `elevacion`, `fijacion`, `corte`, `epi`, `altura`, `sellado` y `utiles`, con subcategorías y facetas permitidas por categoría. Añadir a `CatalogProduct` campos opcionales `category`, `subcategory`, `applications`, `pieceTypes`, `materials` y `technicalAttributes` para una migración incremental.

- [ ] **Step 4: Ejecutar pruebas y tipado**

Run: `npx vitest run data/catalog-taxonomy.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/catalog-taxonomy.ts data/catalog-taxonomy.test.ts data/catalog.ts
git commit -m "feat: define shared marketplace taxonomy"
```

### Task 2: Recuperación auditada del catálogo anterior

**Files:**
- Create: `data/catalog-recovery.ts`
- Create: `data/catalog-recovery.test.ts`
- Create: `scripts/catalog-recovery-audit.mjs`
- Modify: `data/catalog.ts`
- Modify: `lib/catalog-db.ts`

**Interfaces:**
- Consumes: `catalogCategories`, campos ampliados de `CatalogProduct`, `catalogExpansionSeeds`.
- Produces: `recoveredCatalogProducts: CatalogProduct[]`, `CatalogRecoveryIssue`, `auditRecoveredProduct(product)`.

- [ ] **Step 1: Escribir pruebas rojas de recuperación**

Exigir que las 60 referencias actuales sigan presentes; recuperar como máximo 60 Hilti de fijación, 20 Hilti de corte/perforación y 17 Petzl; clasificar cada registro por función; rechazar personas, QR, logotipos, contenido editorial, referencias vacías y documentos que no sean PDF directos cuando se declaren como ficha técnica. Incluir la regresión de imágenes WIMAG.

- [ ] **Step 2: Verificar el fallo**

Run: `npx vitest run data/catalog-recovery.test.ts data/specialized-lifting-catalog.test.ts`
Expected: FAIL porque el catálogo recuperado aún no existe.

- [ ] **Step 3: Implementar selección y adaptación**

Implementar `auditRecoveredProduct(product): CatalogRecoveryIssue[]` y construir `recoveredCatalogProducts` únicamente con expedientes que superen las reglas. Mantener `quote` cuando no exista coste/precio validado. Las marcas se asignan al campo `brand`, nunca a `category`.

- [ ] **Step 4: Crear auditoría reproducible**

El script debe imprimir totales por categoría, marca, expedientes aceptados/rechazados y razones de rechazo; debe terminar con código distinto de cero si una imagen prohibida o una categoría de marca llega al catálogo público.

- [ ] **Step 5: Versionar la migración de base de datos**

Actualizar la versión de semilla en `lib/catalog-db.ts`. Insertar las nuevas referencias sin borrar solicitudes, auditorías ni ediciones administrativas existentes. La composición pública debe seguir la lista vigente del código y aplicar ediciones administrativas por `id`.

- [ ] **Step 6: Ejecutar auditoría, pruebas y tipado**

Run: `node scripts/catalog-recovery-audit.mjs && npx vitest run data/catalog-recovery.test.ts data/specialized-lifting-catalog.test.ts lib/catalog-db.test.ts && npm run typecheck`
Expected: PASS; 60 referencias de elevación conservadas; cero categorías por marca y cero imágenes prohibidas.

- [ ] **Step 7: Commit**

```bash
git add data/catalog-recovery.ts data/catalog-recovery.test.ts data/catalog.ts lib/catalog-db.ts lib/catalog-db.test.ts scripts/catalog-recovery-audit.mjs
git commit -m "feat: recover verified multifamily catalog"
```

### Task 3: Índice de búsqueda, ranking y filtros facetados

**Files:**
- Create: `data/catalog-search.ts`
- Create: `data/catalog-search.test.ts`
- Modify: `data/public-catalog.ts`
- Modify: `data/public-catalog.test.ts`

**Interfaces:**
- Consumes: `PublicCatalogProduct`, `catalogSynonyms`, taxonomía funcional.
- Produces: `buildSearchDocument(product)`, `searchCatalog(products, state)`, `suggestCatalog(products, query, limit)`, `buildFacets(products, state)`, `parseCatalogState(params)`, `serializeCatalogState(state)` y tipos `CatalogSearchState`, `CatalogSuggestion`, `CatalogFacets`.

- [ ] **Step 1: Escribir pruebas rojas de intención de búsqueda**

Probar búsquedas por referencia, marca, tarea, pieza y sinónimo: `coger arqueta` encuentra pinzas de pozo; `perforar hormigón` encuentra corte/perforación; `fijar placa base` encuentra anclajes; `arnés eólico` encuentra altura. Probar tildes, plural, consulta vacía y que coincidencia exacta de referencia tenga prioridad.

- [ ] **Step 2: Escribir pruebas rojas de facetas y URL**

Probar recuentos sobre el conjunto filtrado, opciones imposibles desactivadas, limpieza selectiva, serialización reversible y parámetros desconocidos ignorados.

- [ ] **Step 3: Verificar el fallo**

Run: `npx vitest run data/catalog-search.test.ts data/public-catalog.test.ts`
Expected: FAIL por interfaces ausentes.

- [ ] **Step 4: Implementar índice y ranking determinista**

Normalizar tildes, mayúsculas y plurales simples; expandir sinónimos; ponderar referencia, nombre, aplicación, pieza, categoría, marca y texto restante en ese orden. `suggestCatalog` devolverá productos, categorías, aplicaciones, marcas y la acción `assisted` con máximo configurable.

- [ ] **Step 5: Implementar facetas y estado URL**

Calcular facetas sin mutar productos. `parseCatalogState` aceptará solo valores definidos por la taxonomía; `serializeCatalogState` omitirá valores predeterminados.

- [ ] **Step 6: Ejecutar pruebas y tipado**

Run: `npx vitest run data/catalog-search.test.ts data/public-catalog.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add data/catalog-search.ts data/catalog-search.test.ts data/public-catalog.ts data/public-catalog.test.ts
git commit -m "feat: add intent search and catalog facets"
```

### Task 4: Buscador predictivo accesible

**Files:**
- Create: `components/store/CatalogSearch.tsx`
- Create: `components/store/catalog-search.test.ts`
- Modify: `components/store/MarketplaceMockup.tsx`
- Modify: `app/tienda/tienda.css`

**Interfaces:**
- Consumes: `suggestCatalog`, `CatalogSearchState`, `PublicCatalogProduct`.
- Produces: `CatalogSearch({products, query, onQueryChange, onNavigate, onAssistedSearch})`.

- [ ] **Step 1: Escribir pruebas rojas del componente**

Comprobar estructuralmente que el componente conecta los resultados de `suggestCatalog`, los grupos identificados, el máximo de sugerencias, selección, flechas/Enter/Escape, foco, `aria-expanded`, `aria-activedescendant`, cierre exterior y acción **Ayúdame a elegir**. Las respuestas del índice a consulta vacía y sin coincidencias se prueban en `data/catalog-search.test.ts`.

- [ ] **Step 2: Verificar el fallo**

Run: `npx vitest run components/store/catalog-search.test.ts`
Expected: FAIL porque el componente no existe.

- [ ] **Step 3: Implementar el buscador**

Extraer la barra actual a `CatalogSearch`. Al elegir producto, abrir su ficha; categoría o aplicación, aplicar filtro; marca, aplicar faceta; ayuda, abrir selector técnico. No ejecutar navegación externa.

- [ ] **Step 4: Integrar estilo responsive**

Diseñar desplegable legible sobre el catálogo, con agrupaciones, texto de coincidencia y estados de foco. En móvil debe ocupar el ancho disponible sin ocultar el teclado ni desbordar la pantalla.

- [ ] **Step 5: Ejecutar pruebas y build parcial**

Run: `npx vitest run components/store/catalog-search.test.ts components/store/marketplace-filters.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/store/CatalogSearch.tsx components/store/catalog-search.test.ts components/store/MarketplaceMockup.tsx app/tienda/tienda.css
git commit -m "feat: add accessible predictive catalog search"
```

### Task 5: Filtros facetados y navegación persistente

**Files:**
- Create: `components/store/CatalogFilters.tsx`
- Create: `components/store/catalog-filters.test.ts`
- Modify: `components/store/MarketplaceMockup.tsx`
- Modify: `components/store/marketplace-filters.test.ts`
- Modify: `app/tienda/tienda.css`

**Interfaces:**
- Consumes: `CatalogFacets`, `CatalogSearchState`, `serializeCatalogState`.
- Produces: `CatalogFilters({facets, state, onChange, onClear})`.

- [ ] **Step 1: Escribir pruebas rojas de interacción**

Comprobar el cableado de categorías funcionales, recuentos, opciones desactivadas, filtros activos, limpieza individual/global, panel móvil y mensaje sin resultados que identifica filtros bloqueantes. Los cambios de conjunto y recuentos se prueban como lógica pura en `data/catalog-search.test.ts`.

- [ ] **Step 2: Verificar el fallo**

Run: `npx vitest run components/store/catalog-filters.test.ts components/store/marketplace-filters.test.ts`
Expected: FAIL porque los filtros actuales no son facetados.

- [ ] **Step 3: Implementar filtros y sincronización URL**

Reemplazar `family` por `CatalogSearchState`. Actualizar `history.replaceState` cuando cambie el estado y escuchar `popstate`; no crear entradas de historial por cada pulsación. Conservar consulta al limpiar una faceta y ofrecer limpieza total aparte.

- [ ] **Step 4: Implementar escritorio y móvil**

En escritorio, columna lateral. En móvil, botón con número de filtros activos y panel modal accesible. Mantener visible ordenación y número real de resultados.

- [ ] **Step 5: Ejecutar pruebas**

Run: `npx vitest run components/store/catalog-filters.test.ts components/store/marketplace-filters.test.ts data/catalog-search.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/store/CatalogFilters.tsx components/store/catalog-filters.test.ts components/store/MarketplaceMockup.tsx components/store/marketplace-filters.test.ts app/tienda/tienda.css
git commit -m "feat: add functional faceted catalog filters"
```

### Task 6: Selector técnico orientado a la aplicación

**Files:**
- Create: `components/store/TechnicalFinder.tsx`
- Create: `components/store/technical-finder.test.ts`
- Create: `data/technical-finder.ts`
- Create: `data/technical-finder.test.ts`
- Modify: `components/store/MarketplaceMockup.tsx`
- Modify: `components/store/ProductInquiryPanel.tsx`
- Modify: `app/tienda/tienda.css`

**Interfaces:**
- Consumes: taxonomía, `PublicCatalogProduct`, `searchCatalog`, `ProductInquiryPanel`.
- Produces: `TechnicalFinderState`, `nextFinderStep(state)`, `findTechnicalCandidates(products, state)` y `TechnicalFinder({products, initialIntent, onResults, onRequest, onClose})`.

- [ ] **Step 1: Escribir pruebas rojas de reglas**

Probar recorridos de elevación, fijación, perforación y altura. Exigir peso y geometría antes de marcar una pinza como candidata compatible. Un producto incompleto podrá ser `requires-review`, nunca `compatible`. Probar valores vacíos y retorno a pasos anteriores.

- [ ] **Step 2: Escribir pruebas rojas del panel**

Comprobar estructuralmente progreso, controles dependientes, resumen, candidatos y traspaso de respuestas al formulario de solicitud. El selector debe abrirse desde búsqueda, hero de tienda y estado sin resultados; la transición entre pasos se prueba como función pura en `data/technical-finder.test.ts`.

- [ ] **Step 3: Verificar el fallo**

Run: `npx vitest run data/technical-finder.test.ts components/store/technical-finder.test.ts`
Expected: FAIL por interfaces ausentes.

- [ ] **Step 4: Implementar reglas puras**

Las reglas filtrarán por atributos documentados y devolverán `{product, status:"compatible"|"requires-review", reasons:string[]}`. No calcular cargas ni sustituir documentación del fabricante.

- [ ] **Step 5: Implementar interfaz y solicitud**

Crear flujo por pasos con resumen editable. Si no hay candidato seguro, abrir `ProductInquiryPanel` con consulta, categoría, pieza, material, dimensiones, carga y filtros ya incluidos en el mensaje.

- [ ] **Step 6: Ejecutar pruebas**

Run: `npx vitest run data/technical-finder.test.ts components/store/technical-finder.test.ts components/store/marketplace-filters.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/store/TechnicalFinder.tsx components/store/technical-finder.test.ts data/technical-finder.ts data/technical-finder.test.ts components/store/MarketplaceMockup.tsx components/store/ProductInquiryPanel.tsx components/store/marketplace-filters.test.ts app/tienda/tienda.css
git commit -m "feat: add guided technical product finder"
```

### Task 7: Landing con acceso comercial visible

**Files:**
- Modify: `components/v21/Hero.tsx`
- Modify: `components/v21/StoreDiscovery.tsx`
- Modify: `components/v21/store-discovery.test.ts`
- Modify: `data/v21-content.test.ts`
- Modify: `app/home-v21.css`

**Interfaces:**
- Consumes: categorías y parámetros URL definidos en Tasks 1 y 3.
- Produces: enlaces del landing que abren búsquedas válidas de la tienda.

- [ ] **Step 1: Escribir pruebas rojas del recorrido**

Exigir cabecera **Tienda profesional**, buscador principal, seis accesos funcionales, bloque **Manipula y monta con seguridad**, productos destacados y CTA a tienda completa/selector. Verificar que cada enlace usa parámetros aceptados por `parseCatalogState`.

- [ ] **Step 2: Verificar el fallo**

Run: `npx vitest run components/v21/store-discovery.test.ts data/v21-content.test.ts`
Expected: FAIL porque el landing actual solo expone elevación.

- [ ] **Step 3: Implementar jerarquía comercial**

Mantener el carácter técnico del hero y hacer inequívoco el acceso a tienda. Las tarjetas serán categorías, nunca marcas. Los destacados procederán exclusivamente del catálogo público vigente.

- [ ] **Step 4: Implementar responsive y estados de imagen**

Garantizar que el bloque comercial funciona en móvil y escritorio; si una imagen falla, mostrar el fallback neutro de producto y no una imagen genérica externa.

- [ ] **Step 5: Ejecutar pruebas**

Run: `npx vitest run components/v21/store-discovery.test.ts data/v21-content.test.ts components/store/marketplace-filters.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/v21/Hero.tsx components/v21/StoreDiscovery.tsx components/v21/store-discovery.test.ts data/v21-content.test.ts app/home-v21.css
git commit -m "feat: make marketplace prominent on landing"
```

### Task 8: Administración alineada con la tienda

**Files:**
- Modify: `components/admin/CatalogAdmin.tsx`
- Modify: `components/admin/catalog-admin.test.ts`
- Modify: `app/administracion/filters.css`
- Modify: `lib/catalog-db.ts`
- Modify: `lib/catalog-db.test.ts`

**Interfaces:**
- Consumes: taxonomía, catálogo recuperado, facetas y campos ampliados.
- Produces: edición y filtrado administrativo coherentes con la tienda.

- [ ] **Step 1: Escribir pruebas rojas administrativas**

Exigir filtros por categoría, aplicación, pieza, material, marca y estado documental; edición de taxonomía; indicadores de duplicado, imagen inválida y PDF ausente; acciones masivas solo sobre estado y campos comerciales seguros.

- [ ] **Step 2: Verificar el fallo**

Run: `npx vitest run components/admin/catalog-admin.test.ts lib/catalog-db.test.ts`
Expected: FAIL porque administración solo conoce elevación y familia simple.

- [ ] **Step 3: Implementar filtros y editor**

Usar la taxonomía compartida. Separar filtros en un componente interno si `CatalogAdmin.tsx` supera su responsabilidad actual. Mantener proveedor, coste, margen, transporte y auditoría exclusivamente en la zona protegida.

- [ ] **Step 4: Persistir campos ampliados**

Extender la sanitización de parches administrativos con listas cerradas y límites de tamaño. Registrar cada cambio en `catalog_audit`; no sobrescribir campos fuera del parche.

- [ ] **Step 5: Ejecutar pruebas**

Run: `npx vitest run components/admin/catalog-admin.test.ts lib/catalog-db.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/admin/CatalogAdmin.tsx components/admin/catalog-admin.test.ts app/administracion/filters.css lib/catalog-db.ts lib/catalog-db.test.ts
git commit -m "feat: align catalog administration with taxonomy"
```

### Task 9: Verificación integral y despliegue de vista previa

**Files:**
- Modify only if verification exposes a defect in files owned by Tasks 1–8.

**Interfaces:**
- Consumes: aplicación completa.
- Produces: evidencia reproducible y URL de Vercel Preview.

- [ ] **Step 1: Ejecutar verificación automática completa**

Run: `node scripts/catalog-recovery-audit.mjs && npx vitest run && npm run typecheck && npm run build`
Expected: auditoría limpia, todas las pruebas PASS, tipado y build con código cero.

- [ ] **Step 2: Revisar calidad React**

Aplicar `vercel:react-best-practices` a los componentes TSX modificados: accesibilidad, dependencias de hooks, estado derivado, listeners, renderizado de listas y tamaño de bundle.

- [ ] **Step 3: Probar el recorrido local en navegador**

Verificar escritorio y móvil: búsquedas `coger arqueta`, `HIT-HY 200`, `perforar hormigón`, `arnés eólico`; sugerencias con teclado; cada faceta; URL compartible; selector técnico; apertura de ficha/PDF; solicitud; navegación desde landing; administración.

- [ ] **Step 4: Comprobar regresiones visuales y de datos**

Confirmar ausencia de retratos, QR, logotipos y categorías de marca; 60 referencias de elevación conservadas; fotografías de productos correctas; filtros con recuentos consistentes.

- [ ] **Step 5: Publicar solo Preview**

Run: `npx vercel deploy --yes`
Expected: nueva URL `*.vercel.app` con target `preview`; nunca ejecutar `vercel --prod`.

- [ ] **Step 6: Verificar el despliegue real**

Abrir la URL publicada desde un navegador sin sesión local y repetir búsqueda, filtros, selector, landing, ficha y solicitud. Comprobar estado HTTP 200, consola sin errores de aplicación y que la administración conserva autenticación.

- [ ] **Step 7: Commit de correcciones de verificación, si existen**

```bash
git add <archivos-corregidos>
git commit -m "fix: close marketplace verification findings"
git push origin codex/marketplace-hibrido
```

No crear este commit si no hubo cambios después de la verificación.
