# Customer Account and Inquiry History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production customer account where authenticated users maintain Spanish billing data, submit product inquiries tied to their identity, and track those inquiries from the storefront.

**Architecture:** Clerk remains the identity provider and verified-email source; Neon Postgres stores fiscal profiles and user-linked commercial inquiries. Server routes derive `userId` from `auth()`, expose account-specific DTOs, and never accept a client-selected identity. A branded `/mi-cuenta` UI replaces the generic Clerk profile as the marketplace account surface, while the administrator updates customer-visible inquiry status.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Clerk 6, Neon serverless Postgres, Vitest, Resend, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-15-customer-account-and-inquiries-design.md`

## Global Constraints

- Public catalog browsing remains available without authentication.
- Product inquiry submission requires an authenticated user and a complete customer profile.
- Fiscal data remains in Postgres and is never placed in public Clerk metadata.
- Customer routes derive identity server-side and never select records from a browser-provided `user_id`.
- Existing inquiries are linked only by an exact normalized match to a verified Clerk email and only when currently unlinked.
- The interface uses Spanish copy and the existing black, white, and red Montaje Prefabricado visual system.
- Account and form layouts must work on mobile and desktop.
- No DNI image, birth date, gender, or bank information is collected.
- Account deletion requires explicit confirmation and anonymizes inquiry PII that has no retention obligation.

## Review Focus

- A user with several verified email addresses must link historical inquiries from all verified addresses but never from unverified addresses; Task 3 tests this exact set behavior.
- Two users with similar names or phone numbers must never see each other's inquiries; Tasks 3 and 4 test filtering exclusively by Clerk `userId`.
- A profile switching from company to individual must clear or ignore company-only requirements without leaving an invalid profile; Task 1 tests conditional completeness.
- Concurrent first requests must not fail if schema migration runs twice; Task 2 tests idempotent schema creation and migration declarations.
- If a deleted user had inquiries, public metrics may retain non-personal fields but account, contact fields, documents, and snapshots must be inaccessible; Task 7 tests the anonymized DTO.

---

### Task 1: Customer profile domain model and validation

**Files:**
- Create: `lib/customer-account.ts`
- Create: `lib/customer-account.test.ts`

**Interfaces:**
- Produces: `CustomerType`, `TaxIdType`, `CustomerProfileInput`, `CustomerProfile`, `ProfileCompletion`, `normalizeTaxId(value)`, `isValidSpanishTaxId(type,value)`, `validateCustomerProfile(input)`, `profileCompletion(input)`, `publicInquiryStatus(value)`.

- [ ] **Step 1: Write failing profile validation tests**

Cover valid Spanish individual, self-employed and company profiles; invalid NIF/NIE control characters; missing company legal name; individual profile without legal name; normalized spaces/hyphens; and the five public status labels.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run lib/customer-account.test.ts`  
Expected: FAIL because `lib/customer-account.ts` does not exist.

- [ ] **Step 3: Implement the pure domain functions**

Use discriminated conditional requirements without network calls. Return field-keyed Spanish validation errors and a deterministic list of missing required fields.

- [ ] **Step 4: Run the focused test and verify pass**

Run: `npm test -- --run lib/customer-account.test.ts`  
Expected: all profile validation tests PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add customer profile validation`

### Task 2: Idempotent account and inquiry schema

**Files:**
- Create: `lib/customer-account-db.ts`
- Create: `lib/customer-account-db.test.ts`
- Modify: `lib/catalog-db.ts`

**Interfaces:**
- Consumes: profile types from Task 1.
- Produces: `ensureCustomerAccountSchema()`, `getCustomerProfile(userId)`, `upsertCustomerProfile(userId,email,input)`, `linkHistoricalInquiries(userId,verifiedEmails)`, `getCustomerInquiries(userId)`, `getCustomerInquirySummary(userId)`, `anonymizeCustomerAccount(userId)`, `updateInquiryStatus(id,status,adminNotes,actorId)`.
- Changes `createProductInquiry(input)` to require `userId` and `profileSnapshot`.

- [ ] **Step 1: Write failing schema and query-contract tests**

Assert the migration creates `customer_profiles`, adds `user_id`, `profile_snapshot`, `public_status`, `admin_notes`, and `updated_at`, creates useful indexes, uses `IF NOT EXISTS`, filters customer reads by `user_id`, and never links already-owned inquiries.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run lib/customer-account-db.test.ts`  
Expected: FAIL because the database module does not exist.

- [ ] **Step 3: Implement schema and database operations**

Keep account persistence separate from catalog persistence. Use parameterized Neon tagged templates, normalized lower-case emails, idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, and a closed set of status values.

- [ ] **Step 4: Update catalog inquiry insertion**

Change `createProductInquiry` to write the authenticated owner and immutable profile snapshot while retaining current email notification fields.

- [ ] **Step 5: Run focused and existing database tests**

Run: `npm test -- --run lib/customer-account-db.test.ts lib/catalog-db.test.ts`  
Expected: PASS.

- [ ] **Step 6: Commit**

Commit message: `feat: persist customer profiles and inquiry ownership`

### Task 3: Authenticated profile API and historical linking

**Files:**
- Create: `lib/customer-identity.server.ts`
- Create: `app/api/account/profile/route.ts`
- Create: `app/api/account/profile/route.test.ts`
- Modify: `middleware.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: Task 1 validation and Task 2 persistence.
- Produces: `getCustomerIdentity()` returning `{userId,email,verifiedEmails,firstName,lastName}` or `null`; `GET /api/account/profile`; `PUT /api/account/profile`.

- [ ] **Step 1: Write failing route and identity tests**

Test `401` for signed-out callers, server-derived verified email, field errors for incomplete data, no fiscal values in Clerk public metadata, exact linking across multiple verified addresses, and customer-neutral global sign-in copy.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run app/api/account/profile/route.test.ts`  
Expected: FAIL because the route is absent.

- [ ] **Step 3: Implement the server identity projection**

Return only explicit identity fields from Clerk; never return the full backend user object.

- [ ] **Step 4: Implement GET and PUT profile handlers**

On successful `PUT`, upsert the profile and run idempotent historical linking using verified Clerk emails. Return the saved profile, completeness and linked-count summary.

- [ ] **Step 5: Protect account routes and neutralize global auth copy**

Protect `/mi-cuenta(.*)` and `/api/account(.*)` in middleware. Change global sign-in wording from administration-only to customer-neutral; keep the dedicated administration page's own branded copy.

- [ ] **Step 6: Run focused tests, typecheck and commit**

Run: `npm test -- --run app/api/account/profile/route.test.ts middleware.test.ts && npm run typecheck`  
Expected: PASS.  
Commit message: `feat: add authenticated customer profile API`

### Task 4: Customer inquiry API and secure submission

**Files:**
- Create: `app/api/account/inquiries/route.ts`
- Create: `app/api/account/inquiries/route.test.ts`
- Modify: `app/api/product-inquiries/route.ts`
- Modify: `lib/product-inquiry.ts`
- Modify: `lib/product-inquiry.test.ts`

**Interfaces:**
- Consumes: `getCustomerIdentity()`, profile completeness, Task 2 inquiry queries.
- Produces: `GET /api/account/inquiries` returning `{summary,inquiries}` and an authenticated `POST /api/product-inquiries` that returns `{ok,reference,inquiry}`.

- [ ] **Step 1: Write failing authorization and ownership tests**

Cover signed-out `401`, incomplete-profile `409` with missing fields, ignoring browser-supplied personal identity, customer-only list filtering, sanitized DTO output, and successful creation with `userId` plus profile snapshot.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run app/api/account/inquiries/route.test.ts lib/product-inquiry.test.ts`  
Expected: FAIL on missing authenticated behavior.

- [ ] **Step 3: Implement account inquiry GET**

Return only public status, reference, timestamps, requested product, customer message and safe document links owned by the authenticated user.

- [ ] **Step 4: Refactor inquiry POST**

Obtain customer identity and profile on the server. Remove name, company, email and phone from the trusted request contract; derive them from the stored profile and Clerk email. Keep consent, technical message, product and attachments in the client payload.

- [ ] **Step 5: Preserve email notifications**

Build operational and confirmation emails from the authoritative profile snapshot and verified email. Do not send if database insertion fails.

- [ ] **Step 6: Run tests, typecheck and commit**

Run: `npm test -- --run app/api/account/inquiries/route.test.ts lib/product-inquiry.test.ts && npm run typecheck`  
Expected: PASS.  
Commit message: `feat: bind product inquiries to signed-in customers`

### Task 5: Branded customer account interface

**Files:**
- Create: `app/mi-cuenta/page.tsx`
- Create: `app/mi-cuenta/account.css`
- Create: `components/account/CustomerAccount.tsx`
- Create: `components/account/customer-account.test.ts`
- Modify: `components/store/MarketplaceMockup.tsx`
- Modify: `components/store/marketplace-filters.test.ts`

**Interfaces:**
- Consumes: Tasks 1, 3 and 4 APIs.
- Produces: `/mi-cuenta` with `resumen`, `solicitudes`, `perfil`, and `privacidad` sections; storefront account links that navigate to it.

- [ ] **Step 1: Write failing account UI contract tests**

Assert branded sections, required fiscal fields, conditional legal name, loading/error/empty states, real inquiry rendering, mobile navigation, and `UserButton` navigation to `/mi-cuenta`.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run components/account/customer-account.test.ts components/store/marketplace-filters.test.ts`  
Expected: FAIL because the account UI is absent and the old follow-up panel remains.

- [ ] **Step 3: Implement server-protected account page and responsive shell**

Use the site's `Brand` component and visual tokens. The page must redirect signed-out users to sign-in with a return URL.

- [ ] **Step 4: Implement account data loading and profile editing**

Fetch profile and inquiries independently, display field-level errors, focus the first invalid field, and refresh summary after a successful save.

- [ ] **Step 5: Replace storefront account and request-history behavior**

Configure desktop and mobile `UserButton` controls for navigation to `/mi-cuenta`; change “Mis solicitudes” to navigate to `/mi-cuenta?seccion=solicitudes`; delete the static reference/mail panel.

- [ ] **Step 6: Run tests, typecheck and commit**

Run: `npm test -- --run components/account/customer-account.test.ts components/store/marketplace-filters.test.ts && npm run typecheck`  
Expected: PASS.  
Commit message: `feat: add branded customer account area`

### Task 6: Profile-gated inquiry experience and resumable intent

**Files:**
- Modify: `components/store/ProductInquiryPanel.tsx`
- Create: `components/store/product-inquiry-auth.test.ts`
- Modify: `app/catalog-enhancements.css`

**Interfaces:**
- Consumes: customer profile completeness and authenticated inquiry POST.
- Produces: a product inquiry panel that prompts sign-in/profile completion, preserves pending product intent, resumes after profile save, and no longer asks for duplicate identity fields.

- [ ] **Step 1: Write failing flow tests**

Assert signed-out sign-in CTA, incomplete-profile CTA with return URL and product identity, complete-profile technical form, absence of editable name/email/company fields, `409` handling, and success redirect/link to account history.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run components/store/product-inquiry-auth.test.ts`  
Expected: FAIL against the current free-form contact form.

- [ ] **Step 3: Implement session and profile states**

Use Clerk client session state only to select presentation; rely on the server response for authorization. Persist pending product/kind/message in session storage and pass a return URL to `/mi-cuenta?completar=1`.

- [ ] **Step 4: Implement the authenticated technical request form**

Keep product, message, documents and consent. Render the authoritative account identity as a summary with an “Editar datos” link instead of duplicate inputs.

- [ ] **Step 5: Implement resume and success behavior**

After profile completion, return to the product and reopen the request where supported; after submission, link directly to `/mi-cuenta?seccion=solicitudes`.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- --run components/store/product-inquiry-auth.test.ts lib/product-inquiry.test.ts`  
Expected: PASS.  
Commit message: `feat: gate inquiries on complete customer profiles`

### Task 7: Account deletion and privacy-safe anonymization

**Files:**
- Create: `app/api/account/route.ts`
- Create: `app/api/account/account-delete.test.ts`
- Modify: `components/account/CustomerAccount.tsx`
- Modify: `lib/customer-account-db.ts`
- Modify: `lib/customer-account-db.test.ts`

**Interfaces:**
- Consumes: authenticated identity and Task 2 anonymization.
- Produces: `DELETE /api/account` accepting `{confirmation:"ELIMINAR MI CUENTA"}` and a destructive-action UI requiring that exact phrase.

- [ ] **Step 1: Write failing deletion tests**

Cover signed-out `401`, wrong confirmation `400`, anonymization of contact fields/documents/profile snapshots, preservation of non-personal reference/product/status/dates, no success response when Clerk deletion fails, and double-submit idempotency.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run app/api/account/account-delete.test.ts lib/customer-account-db.test.ts`  
Expected: FAIL because deletion is absent.

- [ ] **Step 3: Implement anonymization and deletion endpoint**

Use a deletion tombstone so retries are safe. Delete the Clerk user only after the database is ready to anonymize, and finish anonymization before returning success. Log only opaque user ID and outcome.

- [ ] **Step 4: Implement the confirmed destructive UI**

Explain that legally required documents may be retained, require the exact phrase, disable while running, and redirect home only on confirmed success.

- [ ] **Step 5: Run tests, typecheck and commit**

Run: `npm test -- --run app/api/account/account-delete.test.ts lib/customer-account-db.test.ts && npm run typecheck`  
Expected: PASS.  
Commit message: `feat: add customer account deletion workflow`

### Task 8: Administrative inquiry workflow

**Files:**
- Modify: `app/api/admin/product-inquiries/route.ts`
- Modify: `components/admin/CatalogAdmin.tsx`
- Modify: `app/administracion/admin.css`
- Create: `components/admin/inquiry-workflow.test.ts`

**Interfaces:**
- Consumes: `updateInquiryStatus` from Task 2 and existing admin authorization.
- Produces: admin `PATCH /api/admin/product-inquiries` accepting `{id,publicStatus,adminNotes}` and an operational inbox editor.

- [ ] **Step 1: Write failing admin workflow tests**

Assert non-admin rejection, closed status allowlist, internal notes excluded from customer DTO, visible customer profile snapshot, save/loading/error feedback, and updated status rendering.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run components/admin/inquiry-workflow.test.ts`  
Expected: FAIL because status editing is absent.

- [ ] **Step 3: Implement protected PATCH route**

Validate the closed status set and bounded note length, update only the selected inquiry, and return the refreshed admin DTO.

- [ ] **Step 4: Implement administrative status editor**

Add status selector, internal note field, save button and feedback to each inquiry without exposing catalog cost controls to the customer side.

- [ ] **Step 5: Run tests, typecheck and commit**

Run: `npm test -- --run components/admin/inquiry-workflow.test.ts && npm run typecheck`  
Expected: PASS.  
Commit message: `feat: manage customer inquiry status`

### Task 9: Full verification, migration and production deployment

**Files:**
- Modify only if verification exposes a defect in files owned by Tasks 1–8.

**Interfaces:**
- Consumes: the complete account and inquiry implementation.
- Produces: verified production deployment and documented deployment evidence.

- [ ] **Step 1: Run all automated verification**

Run: `npm test && npm run typecheck && npm run build && git diff --check`  
Expected: every test passes, typecheck exits `0`, production build succeeds, and no whitespace errors are reported.

- [ ] **Step 2: Deploy to a Vercel preview first**

Run: `npx vercel --yes`  
Expected: preview deployment reaches `Ready` using Preview Clerk and database configuration.

- [ ] **Step 3: Verify complete browser story on preview**

Test desktop and mobile: sign-in return, profile completion, one controlled test inquiry, immediate account listing, admin status update, customer-visible status, cross-account isolation where a second test identity exists, and deletion only with a disposable test user. Do not delete the owner's account.

- [ ] **Step 4: Inspect production environment prerequisites**

Confirm encrypted Production values exist for Clerk, database, Resend and mail routing without printing their values.

- [ ] **Step 5: Deploy production**

Run: `npx vercel --prod --yes`  
Expected: deployment reaches `Ready` and aliases `https://www.montajedeprefabricados.com`.

- [ ] **Step 6: Verify production read paths and protected account routing**

Check homepage, store, signed-out account redirect, branded sign-in, catalog search/filter, and protected APIs. Avoid generating a real commercial inquiry unless using an explicitly controlled test identity and clearly labeled test content.

- [ ] **Step 7: Record final commit and clean status**

Run: `git status --short && git log -1 --oneline && npx vercel inspect https://www.montajedeprefabricados.com`  
Expected: only pre-existing unrelated untracked files remain, HEAD identifies the completed feature, and production status is `Ready`.
