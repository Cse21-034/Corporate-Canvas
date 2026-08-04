# Build Prompt — Constructatech Ventures Web Platform

> **How to use this:** Paste into an agentic full-stack generator (Claude Code, Replit Agent, or Cursor). It builds a marketing site + client portal + CMS in one Next.js repo. If you use a UI-only tool like v0, feed it Sections 3–5 (brand, design system, page specs) for the front-end, then wire the Payload backend separately using Sections 6–9.

---

## 1. Project brief

Build a production-ready web platform for **Constructatech Ventures**, a Botswana-based IT infrastructure, networking, and automation company based in Mahalapye. The platform has three parts inside a single application:

1. **Public marketing site** — corporate site that turns visitors into qualified quote requests. Must be fast, SEO-strong, and premium-looking.
2. **Client portal** — authenticated area where clients track their projects, raise support/change tickets, and view invoices.
3. **CMS admin** — a self-serve admin panel so non-technical staff can edit all marketing content without touching code.

Target audience: enterprise and government buyers in Botswana (mining, manufacturing, healthcare, education, retail, financial services, telecoms, public sector). The tone is trustworthy, engineered, and locally rooted.

## 2. Tech stack (locked — do not substitute)

- **Framework:** Next.js (latest, App Router, TypeScript).
- **CMS + backend:** **Payload CMS 3.x**, installed natively into the same Next.js app (`create-payload-app` website template as the starting point). It provides the admin panel, auth, access control, REST/GraphQL/Local APIs, and the content + portal data models.
- **Database:** PostgreSQL via Payload's `db-postgres` adapter. Use a connection string that works with Supabase Postgres (also compatible with Neon/Railway).
- **File storage:** Configure a cloud storage adapter (S3-compatible, Supabase Storage, or UploadThing) for the `media` collection so uploads survive on serverless hosting. Do **not** rely on local disk.
- **Styling:** Tailwind CSS with design tokens defined below. Framer Motion for the small amount of motion specified.
- **Email:** Payload email adapter (Nodemailer/Resend) to notify `info@constructech.co.bw` on new quote requests.
- **Deploy target:** Vercel-compatible (persistent hosts like Railway/Render also fine). Keep all secrets in env vars.

Deliver clean, typed, componentized code. No placeholder lorem ipsum where real copy is provided below.

## 3. Brand & identity

- **Display name:** Constructatech Ventures. **Tagline:** *Empowering Botswana Through Smart Infrastructure.*
- **Domain / email:** `constructech.co.bw` / `info@constructech.co.bw`. **Note the spelling difference** — the brand name is "Construct**a**tech" but the domain/email drop the second "a" (`constructech`). Use "Constructatech Ventures" everywhere as the display name, and `constructech.co.bw` for all email/domain/URL references. Do not "correct" either one.
- **Phone:** +267 74 259 012. **Address:** P O Box 2059, Mahalapye, Botswana.
- **Copyright line:** © {current year} Constructatech Ventures. Building Botswana's Digital Future.
- **Logo:** a lightning-bolt mark with a left-to-right spectrum gradient (green → lime → orange → magenta → violet) beside a wide-tracked wordmark. Recreate as an inline SVG so it stays crisp; place a lightweight version in the header and a monochrome version in the footer.
- **Brand affiliates (display as a logo strip):** Dell, HP, Cisco, Ubiquiti Networks, Hikvision.

## 4. Design system — premium, corporate, engineered

The goal is enterprise-grade polish that still feels warm and local, not a generic SaaS template. Avoid the three AI-default looks (cream + serif + terracotta; near-black + acid-green; broadsheet hairline columns). Derive everything from the brand's real world: connectivity, signal, infrastructure.

**Color tokens**
- `--ink` #1E212B — primary dark, hero/footer/portal chrome
- `--slate` #2E3140 — raised dark surfaces, cards on dark
- `--coral` #F26A4B — primary accent / CTAs (the brand orange-coral)
- `--coral-deep` #D8492A — hover/pressed accent
- `--paper` #F6F7F9 — light background
- `--mist` #E6E9EF — light dividers / muted surfaces
- `--slate-text` #8A8F9C — secondary text
- **Spectrum accent** (use sparingly, only as a thin "signal" rule or gradient hairline, never as fills): linear-gradient(90deg, #3DBB4E, #9BCB3C, #F5A623, #C4267D, #6A2C91). This echoes the logo — treat it as punctuation, not decoration.

**Typography**
- **Display:** `Sora` (or `Space Grotesk`) — technical, modern, used with confidence for headings.
- **Body:** `Inter` — clean, highly legible for paragraphs and UI.
- **Utility/data:** `IBM Plex Mono` (or `JetBrains Mono`) — for eyebrows, stats, labels, ticket IDs, invoice numbers. The mono face ties the whole thing to the infrastructure theme.
- Set a deliberate type scale; use wide letter-spacing on small uppercase mono eyebrows (mirrors the logo wordmark). Sentence case for body and buttons.

**Signature element (the one memorable thing):** an interactive **connectivity graph** — animated nodes and links (the dot-network motif already in the brand) rendered in canvas/SVG in the hero, subtly reacting to cursor/scroll and resolving toward the tagline. Echo it quietly elsewhere as a faint background texture behind dark sections and as the thin spectrum divider between major sections. Spend the boldness here; keep everything else disciplined and spacious.

**Layout & motion**
- Generous whitespace, strong grid, confident section rhythm. Cards for services/industries with restrained hover lift.
- Motion is minimal and purposeful: hero graph ambient motion, scroll-reveal on section entry, hover micro-interactions on cards/buttons. Respect `prefers-reduced-motion`.

**Quality floor (non-negotiable):** fully responsive to mobile, visible keyboard focus states, semantic HTML, accessible color contrast, alt text on images, and clear empty/error/loading states throughout (see Section 10).

## 5. Sitemap & page specifications

Use the real copy below. Public pages are statically rendered (SSG/ISR) and pull editable content from Payload.

**Home (`/`)**
- Hero: connectivity-graph signature + headline built on *"Empowering Botswana Through Smart Infrastructure"* and the positioning line: *"We don't just install hardware; we build the digital backbone for your success."* Primary CTA "Request a quote", secondary "Explore solutions".
- Services teaser: the four Core Solutions as cards (see below), each linking to its detail page.
- Industries strip: the eight sectors.
- Brand affiliates logo strip.
- Trust/values band: the three core values.
- Closing CTA band → quote form.

**About (`/about`)**
- About copy: *"Constructatech Ventures is Botswana's partner in digital transformation. We specialize in the supply, installation, and management of cutting-edge IT systems and automation projects. Established to bridge the gap between local businesses and global technology standards, we empower organizations across Botswana to stay ahead in an increasingly automated world."*
- **Mission:** *"To drive business success in Botswana by delivering innovative, reliable, and cost-effective IT infrastructure and automation solutions that enhance productivity and ensure seamless connectivity."*
- **Vision:** *"To be recognized as Botswana's leading specialist in IT infrastructure and automation, setting the standard for quality solutions that transform business operations and provide a distinct competitive edge."*
- **Core values** (present the Setswana names as a distinctive feature, each with its English meaning and description):
  - **Boikanyego — Reliability:** In the Botswana market, trust is earned. We build systems that are robust and dependable, ensuring your operations never skip a beat. Our word is our bond.
  - **Puso — Innovation & Ownership:** We take full ownership of every project, from concept to commissioning, continuously seeking innovative methods to solve local challenges and keep your infrastructure future-ready.
  - **Tirelo — Service Excellence:** We put clients first, providing end-to-end support and tailored solutions that fit the unique landscape of Botswana's industries — treating your business as part of our community.

**Solutions index (`/solutions`) + four detail pages (`/solutions/[slug]`)**
1. **IT Infrastructure Solutions** — "Building the foundation for your growth. We design robust data centers and scalable cloud environments tailored for the Botswana climate and business needs." Includes: Data Center Design, Cloud Infrastructure, Server & Storage.
2. **Networking Services** — "Ensuring high-speed, secure connectivity across your operations. We specialize in LAN/WAN setup and advanced security protocols to protect your data." Includes: Network Architecture, Firewalls, Wireless/Wired Setup.
3. **IT Supplies & Hardware** — "A one-stop shop for quality IT equipment. We supply everything from workstations to enterprise storage solutions, ensuring you get the right tools for the job." Includes: Servers, Routers, Switches, Laptops, Peripherals.
4. **Automation & Instrumentation** — "Optimizing workflows for the modern age. From mining conveyor systems to Building Management Systems (BMS), we automate processes to save time and reduce costs." Includes: Industrial Automation, Building Automation (BMS), Remote Monitoring.

**Industries (`/industries`)** — Mining, Manufacturing, Healthcare, Education, Retail, Financial Services, Telecommunications, Government & Public Sector. Each as a card; make content CMS-editable so staff can add sector-specific detail later.

**Contact / Get a quote (`/contact`)** — quote/enquiry form (Section 9), plus address (P O Box 2059, Mahalapye), phone, email, and a small Botswana map/silhouette accent. "We are ready to discuss your next project. Whether you need a complete network overhaul or a simple hardware supply, our team is here to help."

**Global:** sticky header with logo + nav (About, Solutions, Industries, Contact, and a "Client portal" login link) + "Request a quote" button; footer with contact block, nav, affiliate strip, and copyright line.

## 6. Data model (Payload collections)

**Content collections (CMS-editable by staff):**
- `pages` — flexible, block-based (hero, services grid, industries strip, values band, CTA, rich text) so staff can compose pages.
- `services` — title, slug, summary, body, feature list (the "Includes:" items), icon, order.
- `industries` — name, slug, blurb, icon, order.
- `values` — setswanaName, englishName, description, order.
- `partners` — name, logo (media), url, order.
- `testimonials` — quote, author, company, logo (optional).
- `team` — name, role, photo, bio (optional).
- `media` — uploads (cloud storage adapter).
- `siteSettings` (global) — phone, email, PO Box/address, social links, affiliate list, hero copy.

**Portal collections:**
- `customers` (auth-enabled) — companyName, contactName, email, phone, logo, status.
- `projects` — title, description, status (enum: scoping / in-progress / on-hold / completed), customer (relationship), milestones (array: label, dueDate, done), assignedStaff (relationship to users), startDate, targetDate.
- `tickets` — subject, type (support / change-request), priority (low/med/high/urgent), status (open / in-progress / resolved / closed), customer, project (optional), messages (array: author, body, timestamp, attachments).
- `invoices` — number, customer, project (optional), amount, currency (default BWP), status (draft/sent/paid/overdue), issueDate, dueDate, pdf (media).
- `quoteRequests` — name, company, email, phone, serviceInterest (relationship to services, multi), industry (optional), message, status (new / contacted / quoted / won / lost), createdAt.

## 7. Authentication & roles

- Two auth collections. **`users`** = staff, with roles `admin` and `editor`; only staff can access `/admin`. `editor` can edit content collections; `admin` can additionally manage customers, projects, invoices, tickets, and users.
- **`customers`** = client login for the portal only; **no** access to `/admin`.
- Enforce access control so a logged-in customer can read/write **only their own** projects, tickets, and invoices (scope every portal query by the authenticated customer). Staff see everything.
- Provide login, logout, forgot/reset password for both. Rate-limit auth endpoints.

## 8. Client portal (`/portal/*`, auth required)

- **Dashboard** — greeting, at-a-glance cards: active projects, open tickets, unpaid invoices, recent activity.
- **Projects** — list + detail. Detail shows status, milestone checklist with progress, assigned team, timeline.
- **Tickets** — list, filter by status, create new ticket, threaded conversation view with attachments. Staff replies appear in the same thread.
- **Invoices** — list with status badges, download PDF, clear "paid/overdue" states.
- **Account** — edit contact details, change password, upload company logo.
- Portal UI shares the design system but uses a calmer, denser app layout (sidebar nav on desktop, bottom/hamburger nav on mobile) with the `ink`/`slate` chrome and coral accents.

## 9. Public forms

- **Quote request form** on `/contact` (and reachable from every "Request a quote" CTA): name, company, email, phone, service interest (multi-select from `services`), industry (optional), message. On submit: create a `quoteRequests` record with status `new`, send a notification email to `info@constructech.co.bw`, and show a clear success state. Validate inputs; never use raw HTML `<form>` posts that bypass validation — handle via typed handlers/server actions.
- Include honeypot or basic spam protection.

## 10. Non-functional requirements

- **SEO:** per-page metadata, Open Graph/Twitter cards, sitemap.xml, robots.txt, JSON-LD `Organization` + `LocalBusiness` (Mahalapye, Botswana). Semantic headings.
- **Performance:** static/ISR for marketing pages, optimized images (next/image), lazy-load the hero graph, good Core Web Vitals.
- **Accessibility:** WCAG AA contrast, keyboard-navigable, visible focus, reduced-motion support, alt text.
- **States:** every list/async view has explicit loading, empty ("No open tickets — you're all caught up"), and error states written in the interface's voice (clear, active, non-apologetic).
- **Content in code:** use the real copy provided; where copy is missing, write concise, specific, on-brand text — never lorem ipsum.

## 11. Setup & deployment

- Provide a `.env.example` with: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, storage adapter keys, email/SMTP keys.
- Include seed data: the 4 services, 8 industries, 3 values, 5 affiliate partners, `siteSettings`, one demo staff `admin`, one demo `customer` with a sample project, ticket, and invoice.
- README covering local setup, running Payload + Next.js, seeding, and deploying to Vercel (+ note on cloud storage for media on serverless).
- Sensible `.gitignore`; no secrets committed.

## 12. Definition of done

- [ ] Marketing site (Home, About, Solutions + 4 detail, Industries, Contact) live and fully responsive, populated with the real copy above.
- [ ] All marketing content editable from the Payload admin by an `editor` with no code.
- [ ] Quote form creates a `quoteRequests` record and emails `info@constructech.co.bw`.
- [ ] Customer can log in, see only their own projects/tickets/invoices, raise a ticket, and download an invoice PDF.
- [ ] Staff `admin` can manage content, customers, projects, tickets, and invoices.
- [ ] Brand + design system applied exactly; connectivity-graph signature present in the hero; spectrum accent used only as a thin signal rule.
- [ ] SEO, accessibility, and loading/empty/error states in place.
- [ ] Seed data + README + `.env.example` included; project runs from a clean clone.

## 13. Build order (do it in this sequence)

1. Scaffold Next.js + Payload (Postgres + cloud storage), env, README.
2. Content collections + `siteSettings` + seed data.
3. Design system (tokens, fonts, base components) + global header/footer.
4. Marketing pages wired to Payload content.
5. Quote form → `quoteRequests` + email notification.
6. Auth (`users` + `customers`), roles, access control.
7. Portal: dashboard → projects → tickets → invoices.
8. SEO, accessibility, states, polish, and final review against Section 12.

Ship steps 1–5 as an independently launchable milestone before starting 6.
