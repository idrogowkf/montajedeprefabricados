# SEO Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing site's SEO layer around one validated intent map without changing the approved V2.1 visual identity.

**Architecture:** A typed SEO registry owns metadata, intent, FAQs and internal relationships. Route components consume that registry through shared metadata/schema/page helpers; sitemap consumes the same route inventory.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-05-seo-architecture-design.md`

## Global Constraints

- Preserve all API endpoints and form behavior.
- Do not invent operational credentials or project history.
- Every indexable URL must be unique, self-canonical and linked.
- Keep the approved V2.1 visual language.

---

### Task 1: Typed SEO registry and validation

**Files:**
- Create: `data/seo-pages.ts`
- Create: `data/seo-pages.test.ts`
- Modify: `lib/seo.ts`

- [ ] Write tests for unique titles, descriptions, paths, target queries and complete FAQ/schema inputs.
- [ ] Run the tests and verify failure because the registry does not exist.
- [ ] Implement the registry and reusable metadata/JSON-LD builders.
- [ ] Run the focused tests to green.

### Task 2: Service, type and local landing integration

**Files:**
- Create: `components/v21/SeoJsonLd.tsx`
- Create: `components/v21/SeoLandingPage.tsx`
- Modify: `app/servicios/[slug]/page.tsx`
- Modify: `components/v21/TechnicalServicePage.tsx`
- Modify: `app/(marketing)/[city]/page.tsx`
- Modify: `app/(marketing)/tipos/*/page.tsx`
- Modify: `app/servicios/montaje-prefabricado-hormigon/page.tsx`

- [ ] Write route rendering and metadata assertions.
- [ ] Verify they fail against the inherited pages.
- [ ] Connect every route to the registry, shared landing layout and schemas.
- [ ] Add the permanent duplicate redirect and rerun tests.

### Task 3: Home, discovery and crawl controls

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `components/landing-v21.tsx`
- Create: `components/v21/HomeSeoContent.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `components/v21/Footer.tsx`

- [ ] Write sitemap and discovery tests.
- [ ] Verify they fail before implementation.
- [ ] Add home FAQ/internal discovery, global metadata, organization/website schema and data-driven sitemap.
- [ ] Run all tests, typecheck, production build and route/link audit.

### Task 4: Final evidence and commit

**Files:**
- Modify: documentation only if verification reveals a discrepancy.

- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Audit generated routes, canonicals, JSON-LD and internal links.
- [ ] Commit all intentional files once; exclude `fix-encoding.js`.
