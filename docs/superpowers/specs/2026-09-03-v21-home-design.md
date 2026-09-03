# Home V2.1 Design Specification

## Objective

Rebuild the existing Next.js home as a faithful componentized implementation of `montaje-prefabricados-v2.1.html`, preserving the current SEO routes and server infrastructure while replacing the obsolete yellow SaaS-style presentation.

## Visual system

The source HTML is authoritative. The interface uses black, white, industrial grey and `#EF233C`; square editorial geometry; the MP polygon mark; condensed display typography; monochrome project photography; integrated header and hero; and restrained motion with reduced-motion fallbacks. Existing local project photographs replace the prototype's remote images.

## Architecture

`app/page.tsx` remains a Server Component and composes focused section components. Static sections stay server-rendered. Only capabilities hover/tap behavior, the pre-study wizard and the technical-centre interaction are Client Components. Shared copy and types live outside components.

## Pre-study

The six-step flow stores one typed state object so back/next navigation never loses values. Validation is progressive and limited to project type or description, approximate location, name and either email or telephone. The final step contains an editable summary. Files support PDF, spreadsheets, images, archives and CAD attachments, with ten-file and 25 MB per-file limits, visible status and removal.

Uploads use Vercel Blob client uploads through a token-generating server route. The browser never receives permanent credentials. The final JSON request contains form data, uploaded Blob references and an optional generic external URL. When Blob is not configured, the UI reports the missing service without losing the form state.

## Submission

`POST /api/prestudy` validates and sanitizes all input again, checks a honeypot and applies a lightweight in-memory rate limit. It generates an `MP-YYYY-XXXXXX` reference, sends a structured internal Resend message and a client confirmation when an email is available, then returns the reference for an inline success state. Existing APIs remain untouched.

## SEO, accessibility and performance

Existing metadata, canonical, JSON-LD, robots, sitemap and marketing routes are preserved. The Home retains one semantic H1 and crawlable section copy. Inputs use real labels, errors use `aria-live`, wizard controls are keyboard operable, and focus is managed between steps. Local `next/image` assets provide responsive delivery; the hero uses an optimized local image fallback until licensed video exists.

## Verification

Run `npx tsc --noEmit`, the project lint command when available, `npm run build`, and `git diff --check`. Verify desktop and mobile navigation, all wizard transitions, single/multiple selection, file validation/removal, external links, technical-centre handoff, inline confirmation, image loading, console errors and horizontal overflow.
