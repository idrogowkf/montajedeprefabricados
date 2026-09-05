# V2.1 UX and Technical Content Design

## Objective

Improve the approved V2.1 Home without replacing its visual language or its existing Next.js architecture. The iteration fixes the pre-study date input, upgrades both transactional emails, replaces shallow technical interactions with useful engineering content, gives each core capability a dedicated page, and keeps direct contact available globally.

## Constraints

- Preserve the V2.1 black, white, industrial grey, and `#ef233c` visual system.
- Preserve the existing six-step pre-study flow and `/api/prestudy` contract.
- Preserve existing SEO routes, APIs, sitemap, robots, canonical metadata, and structured data unless a new requested route requires its own metadata and sitemap entry.
- Do not invent projects, clients, certifications, fleet ownership, results, testimonials, loads, or performance figures.
- Treat all technical guidance as preliminary and subject to project-specific verification.
- Use local images and the MP identity already present in the repository.
- Keep server components by default and client components only where interaction is required.
- Do not promote any deployment to production during this iteration.

## 1. Pre-study date input

The existing native date field is unreliable in the observed Preview browser. Replace the single opaque control with an accessible date-input group that supports both interaction paths:

- A visible calendar control based on `<input type="date">` for browsers that support a native picker.
- A clearly labelled manual date field accepting `DD/MM/YYYY` for keyboard and mobile entry.
- One canonical ISO `YYYY-MM-DD` value stored in `PreStudyData.date` and sent through the existing payload.
- A button labelled `Abrir calendario` that calls `showPicker()` when supported and otherwise focuses the native control.
- Validation for real calendar dates, including leap years, without making the field mandatory.
- No loss of the selected date when moving backward or forward through the wizard.

## 2. Transactional emails

Extract email rendering from `app/api/prestudy/route.ts` into a focused server-only module. It will render two responsive, table-based HTML documents suitable for mainstream email clients.

### Administrative email

Include:

- MP logo rendered as an email-safe branded header rather than a remote decorative dependency.
- `MONTAJE PREFABRICADO` wordmark.
- Request reference and submission timestamp.
- Contact, company, email, telephone, location, target date, project type, piece data, needs, access, storage, constraints, notes, external link, and uploaded-document links.
- A visible reply/contact action.
- Footer with `ofertas@montajedeprefabricados.com`, `+34 624 473 123`, and `montajedeprefabricados.com`.

### Client confirmation email

Include:

- The same MP identity and contact footer.
- Request reference.
- A compact summary of every project datum supplied by the client.
- A statement that missing technical data can be completed during review.
- Expected next step: technical review followed by contact, with no invented response-time guarantee.
- A direct email link, telephone link, and WhatsApp link.

HTML content must continue escaping all user-controlled values. A plain-text alternative must accompany each email. The API returns success only after Resend accepts the administrative email and, when an email address is supplied, the client confirmation.

## 3. On-site confirmation

After a successful submission, preserve the existing reference panel but change the message to explain:

`Recibirás este código y un resumen de los datos del estudio en tu correo. Consérvalo para completar información o consultar el estado de la solicitud.`

If the user supplied only a telephone number, do not falsely claim an email was sent; state instead that the reference is shown on screen and will identify the request during follow-up.

## 4. Process interaction

Turn the five rows in `Precisión en cada fase` into an accessible disclosure list:

- Each row is a real button with `aria-expanded` and `aria-controls`.
- Opening a row reveals a concise but substantive explanation, required inputs, and the decision produced by that phase.
- Only one row needs to be open at a time.
- Keyboard operation must work with Enter and Space.
- Content covers piece schedules and drawings, site/access survey, erection sequence and temporary stability, lifting resources/logistics, and execution coordination/close-out.

## 5. Capabilities and technical service pages

Each of the five capability rows remains visually consistent with V2.1 but becomes a real internal link. The image-preview behaviour remains, while activation navigates to a dedicated page.

Create these routes:

- `/servicios/montaje-prefabricados`
- `/servicios/ingenieria-de-montaje`
- `/servicios/lifting-plan`
- `/servicios/gruas-y-maniobras`
- `/servicios/logistica-de-obra`
- `/servicios/asistencia-tecnica`

All routes reuse a shared `TechnicalServicePage` layout with Header, breadcrumb, service hero, engineering scope, inputs, decisions/deliverables, limitations, related services, pre-study CTA, floating actions, and Footer.

The `lifting-plan` route receives a prominent link from both the Home and engineering-related pages. It explains:

- Load data: geometry, mass, centre of gravity, lifting inserts, rigging points, and orientation changes.
- Crane data: configuration, boom, counterweight, operating radius, hook height, chart capacity, deductions, and set-up area.
- Site data: bearing conditions, outrigger reactions, obstacles, exclusion zones, wind constraints, assembly space, and access.
- Rigging: slings, spreader beams, shackles, lifting clutches, included angles, and component capacities.
- Operation: pick position, travel/slewing path where relevant, landing position, communications, sequence, temporary support, and hold points.
- Deliverables: assumptions register, configuration, lift geometry, capacity verification, rigging arrangement, plan views, sequence, constraints, and unresolved-data list.
- Boundaries: preliminary study versus project-specific engineered documentation and approvals.

## 6. Project-type navigation

The cards in `Obras que necesitan criterio` navigate to the existing real type routes. They must not open an unclosable overlay. If any detail overlay remains necessary on the Home, it must include:

- A visible close button.
- Escape-key closing.
- Backdrop closing.
- Focus trapping while open and focus restoration after closing.
- An explicit `Ver página técnica` link.

The preferred implementation is direct navigation using Next.js `Link`, with clear breadcrumb and Home link on the destination page. Browser Back remains functional.

## 7. Technical Centre

Replace the simulated question-and-answer interface and the phrase `Pregunta antes de improvisar` with a documented technical knowledge block.

The Home presents five substantial topics:

- Minimum documentation and traceability.
- Erection sequence and temporary stability.
- Crane selection and lifting-plan inputs.
- Site logistics, access, storage, and delivery order.
- Safety integration from design and fabrication.

Each topic provides a practical checklist, explains why the information changes the operation, and links to the most relevant technical service page. The content must be original and informed by authoritative or specialist references, including:

- Sector documentation on traceability between design, piece definition, logistics, and erection.
- Safety recommendations concerning lifting devices, lifelines, bracing anchors, and planning before erection.
- Technical material on bringing erection and safety needs upstream into design and fabrication rather than solving them reactively on site.
- Recognised lifting/erection guidance for load mass, rigging configuration, crane set-up, temporary support, ground/access conditions, exclusion zones, and documented sequencing.

Source links appear in a restrained `Fuentes para ampliar` block. The site does not present itself as affiliated with or endorsed by those sources.

## 8. Global contact actions

Add one shared `FloatingContactActions` client component to the root layout so it appears on the Home and every existing or new route.

- WhatsApp button: `https://wa.me/34624473123` with a concise prefilled project-enquiry message.
- Pre-study button: links to `/#preestudio` from internal pages and scrolls smoothly to `#preestudio` when already on the Home.
- Both controls have visible labels where space permits, accessible names, keyboard focus, safe mobile offsets, and reduced-motion support.
- They must not cover wizard navigation, browser controls, or important page content.

## 9. Navigation and metadata

- Use `next/link` for internal routes.
- Every new page has a unique title, description, canonical URL, H1, and internal links.
- Add the six routes to `app/sitemap.ts`.
- Preserve all existing metadata and structured data for existing pages.
- Header and Footer expose direct email, telephone, WhatsApp, Home, services, lifting plan, and pre-study access without overcrowding the approved hero composition.

## 10. Testing and acceptance

Automated tests must cover:

- Manual-date parsing, formatting, invalid dates, and leap years.
- Preservation of the canonical ISO payload.
- Administrative and client email templates containing MP identity, reference, contact details, supplied project fields, escaped user input, and plain text.
- Conditional on-site confirmation copy for email versus telephone-only submissions.
- Every capability mapping to its intended route.
- Process disclosures exposing substantive content.
- Sitemap inclusion for all six routes.

Browser verification must cover:

- Date entry by keyboard and calendar button in desktop and mobile viewports.
- Wizard forward/back persistence and successful Preview submission.
- Receipt/acceptance of administrative and client emails using an authorised test address.
- Process disclosure keyboard behaviour.
- Capability and project-card navigation, breadcrumbs, Home return path, and browser Back.
- Floating WhatsApp and pre-study actions on the Home and an internal route.
- No horizontal overflow, inaccessible focus traps, console errors, or broken local images.

Final gates:

- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Successful Vercel Preview deployment and protected endpoint verification.
- No production promotion.
