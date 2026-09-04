# V2.1 UX and Technical Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the V2.1 pre-study UX, deliver branded transactional email, replace shallow interactions with useful technical content, and add navigable technical service pages and global contact actions.

**Architecture:** Keep the existing V2.1 composition and `/api/prestudy` contract. Add small reusable utilities for date conversion and email rendering, data-driven technical-page content, and focused client components only for disclosures and floating actions.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind/CSS, Vitest, Resend, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-04-v21-ux-technical-content-design.md`

## Global Constraints

- Preserve the approved V2.1 visual identity and existing API payload.
- Do not invent clients, projects, certifications, fleet, figures, or guarantees.
- Keep user-controlled email content escaped.
- Do not promote to production.
- Keep `fix-encoding.js` untracked and outside every commit.

---

### Task 1: Date input and confirmation copy

**Files:**
- Create: `lib/date-input.ts`
- Create: `lib/date-input.test.ts`
- Create: `components/prestudy/DateInput.tsx`
- Modify: `components/prestudy/SiteStep.tsx`
- Modify: `components/prestudy/PreStudy.tsx`

**Interfaces:**
- Produces: `parseSpanishDate(value: string): string`, `formatSpanishDate(value: string): string`, and `DateInput({value,onChange})`.
- Preserves: `PreStudyData.date` as ISO `YYYY-MM-DD`.

- [ ] Write tests proving valid Spanish dates convert to ISO, ISO formats to Spanish, impossible dates fail, and leap years work.
- [ ] Run `npx vitest run lib/date-input.test.ts` and verify failure because the module does not exist.
- [ ] Implement strict conversion utilities and rerun the test.
- [ ] Add `DateInput` with native date input, manual input, `Abrir calendario`, labels, and accessible error text.
- [ ] Replace the existing date field and update success copy for email versus telephone-only contact.
- [ ] Run `npm test` and `npm run typecheck`.
- [ ] Commit as `fix(prestudy): make project date entry reliable`.

### Task 2: Branded administrative and client emails

**Files:**
- Create: `lib/prestudy-email.ts`
- Create: `lib/prestudy-email.test.ts`
- Modify: `app/api/prestudy/route.ts`

**Interfaces:**
- Produces: `renderAdminPreStudyEmail(data, reference)` and `renderClientPreStudyEmail(data, reference)`, each returning `{html,text}`.
- Consumes: sanitized `PreStudyData` and the existing request reference.

- [ ] Write tests asserting MP identity, reference, all relevant fields, contact links, client summary, plain text, and HTML escaping.
- [ ] Run the focused test and verify failure because renderers do not exist.
- [ ] Implement a shared email-safe shell, branded header, structured data rows, contact footer, administrative body, and client body.
- [ ] Replace inline HTML in `/api/prestudy` while preserving validation, recipients, subjects, and success semantics.
- [ ] Run focused tests, full tests, typecheck, and build.
- [ ] Commit as `feat(email): add branded pre-study confirmations`.

### Task 3: Technical disclosures and corrected navigation

**Files:**
- Modify: `data/v21-content.ts`
- Modify: `components/v21/ProcessSection.tsx`
- Modify: `components/v21/CapabilitiesSection.tsx`
- Modify: `components/v21/ProjectTypes.tsx`
- Modify: `app/v21.css`
- Modify: `app/v21-extra.css`
- Create: `data/v21-content.test.ts`

**Interfaces:**
- Extends each process step with `summary`, `inputs`, and `output`.
- Extends each capability with `href`.

- [ ] Write mapping tests for five capability routes and substantive process content.
- [ ] Run tests and verify the new assertions fail.
- [ ] Convert process rows to single-open accessible disclosures.
- [ ] Convert capability rows and project cards to `next/link`, preserving image activation and adding explicit destination labels.
- [ ] Ensure destination pages provide breadcrumbs and Home links instead of modal traps.
- [ ] Run tests and typecheck.
- [ ] Commit as `fix(home): make technical interactions useful and navigable`.

### Task 4: Service pages and technical centre

**Files:**
- Create: `data/technical-services.ts`
- Create: `data/technical-services.test.ts`
- Create: `components/v21/TechnicalServicePage.tsx`
- Create: `app/servicios/[slug]/page.tsx`
- Modify: `components/v21/TechnicalCenter.tsx`
- Modify: `components/v21/Header.tsx`
- Modify: `components/v21/Footer.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/v21.css`
- Modify: `app/v21-extra.css`

**Interfaces:**
- Produces six `TechnicalService` records selected by slug and statically generated routes.
- Reuses Header, FinalCTA, Footer, and V2.1 layout.

- [ ] Write tests for all six unique slugs, titles, descriptions, sections, related links, and lifting-plan coverage.
- [ ] Verify failure before creating the service dataset.
- [ ] Implement original engineering-focused content based on reviewed sources without copied claims or invented credentials.
- [ ] Implement the shared page and static route metadata.
- [ ] Replace the simulated chat with five substantial knowledge disclosures and source links.
- [ ] Add restrained service/lifting-plan/contact navigation to Header and Footer.
- [ ] Add all six routes to the sitemap and tests.
- [ ] Run tests, typecheck, and build.
- [ ] Commit as `feat(content): add technical service knowledge cluster`.

### Task 5: Global contact actions

**Files:**
- Create: `components/v21/FloatingContactActions.tsx`
- Create: `components/v21/FloatingContactActions.test.tsx` only if the installed test environment supports DOM rendering; otherwise verify its pure route helper in `lib/floating-actions.test.ts`.
- Modify: `app/layout.tsx`
- Modify: `app/v21.css`
- Modify: `app/v21-extra.css`

**Interfaces:**
- Produces global WhatsApp and pre-study actions.
- Uses `/#preestudio` off Home and smooth-scrolls to `#preestudio` on Home.

- [ ] Write a failing test for route selection and required accessible labels.
- [ ] Implement the component without external libraries.
- [ ] Mount it once in the root layout and add responsive/reduced-motion styles.
- [ ] Run full tests, typecheck, build, and `git diff --check`.
- [ ] Commit as `feat(contact): add global V2.1 contact actions`.

### Task 6: Preview verification

**Files:**
- Modify: `README.md` only if environment or verification instructions changed.

- [ ] Start the local server and verify desktop/mobile date input, disclosures, internal links, breadcrumbs, Back navigation, contact actions, images, overflow, and console.
- [ ] Submit one authorised test pre-study with an email address and confirm both Resend operations return success.
- [ ] Run `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check` fresh.
- [ ] Push `codex/v2.1-home`, wait for Vercel Preview `Ready`, and test `/api/prestudy` through deployment protection.
- [ ] Do not promote the Preview to production.
