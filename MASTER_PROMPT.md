# Master Prompt — Diadem Sri Lanka (diademsports.lk)

> Paste everything below this line into an AI coding assistant (or hand it to a developer) to build this
> website from scratch, or to continue working on it with full context.

---

## 0. Your role and ground rules

You are a senior full-stack engineer building **diademsports.lk**, the official brand showcase and
product-discovery website for **Diadem** (the US tennis & pickleball brand) in Sri Lanka. The site is run by
the retailer **United Sports (Pvt) Ltd**, which sells online at **unitedsports.lk** (a Shopify store).

Rules you must follow throughout:

1. **No cart, no checkout, no payments.** This site *showcases* products. Every "Buy now" button opens the
   exact product on unitedsports.lk (with UTM tracking), where the purchase happens.
   Flow: `showcase → product discovery → product page → BUY NOW → unitedsports.lk product → cart → checkout`.
2. **Never invent facts.** Product names, prices, specs and photos come only from unitedsports.lk listings.
   Brand story, technologies and athletes come only from diademsports.com. Anything not yet confirmed is
   marked as sample content (visible badge + `noindex`). Drop subjective rating rows ("High", "★★★★★") and
   "confirm with manufacturer" placeholders from specs.
3. **The site must work with zero configuration.** Without a database it runs on bundled JSON data. Adding
   Supabase/Resend keys switches on the admin, uploads, newsletter and contact form. Missing services show a
   friendly "temporarily unavailable" message — never a crash.
4. **Security first:** secrets only on the server, row-level security on every table, rate-limited forms and
   login, image uploads re-encoded to strip EXIF/GPS, strict security headers.
5. **Accessibility and performance:** keyboard-navigable, skip link, focus traps in overlays, visible focus
   rings, alt text everywhere, all animation disabled under `prefers-reduced-motion`.
6. **The owner is not a developer.** Explain changes in plain language and keep the README as a step-by-step
   operating manual.
7. This uses **Next.js 16** — APIs differ from older versions. Read `node_modules/next/dist/docs/` before
   writing code and heed deprecation notices.

---

## 1. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16.4** (App Router, Turbopack, Server Components, Server Actions), **React 19.3** |
| Language | **TypeScript** (strict), Node **22+** |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens in `globals.css`, `@tailwindcss/turbopack` loader), `clsx` + `tailwind-merge` via a `cn()` helper |
| Animation | **GSAP 3** + `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText |
| Icons | `lucide-react` |
| Database & file storage | **Supabase** (Postgres + Storage) via `@supabase/supabase-js` with the **service-role key, server-only** |
| Migrations | Plain SQL files in `supabase/migrations/`, applied by a custom Node script using `pg` |
| Email | **Resend** (contact form delivery, newsletter contacts/segment) |
| Validation | **Zod v4** on every form and server action |
| Images | `next/image` (remote patterns for Shopify CDN + Supabase storage); **sharp** on the server for uploads |
| Hosting | **Netlify** with `@netlify/plugin-nextjs` (`netlify.toml`, Node 22) |
| Fonts | `next/font/google`: **Archivo** (variable width axis, used condensed for display) + **JetBrains Mono** (eyebrows/labels) |

npm scripts:

```
dev          node scripts/migrate.mjs --soft && next dev     # migrate (warn-only) then dev server
build        node scripts/migrate.mjs && next build          # migrate (fail on error) then build
start        next start
check        typecheck + lint
migrate      apply DB migrations manually
import:store re-import every Diadem product from unitedsports.lk into the bundled seed
import:diadem import Diadem-range products NOT sold locally (from diademsports.com) as info-only pages
art          regenerate the placeholder SVG artwork
```

---

## 2. Project structure

```
src/
  app/
    layout.tsx               root: fonts, metadata, pre-paint motion script, LogoProvider
    (site)/                  public site (route group with header/footer/announcement/newsletter popup)
      page.tsx               home
      products/(list)/       all products + filters (+ loading.tsx)
      products/[slug]/       product page + per-product opengraph-image.tsx
      category/[slug]/       collection pages
      technologies/ diadem/ athletes/ about/ contact/ news/ news/[slug]/
      sponsorship/ sponsorship/[slug]/   academy + sponsored-player pages
      wishlist/ unsubscribe/ privacy/ terms/
      template.tsx error.tsx not-found.tsx
    admin/
      login/                 login form
      (panel)/               protected dashboard: products, products/[id], products/new,
                             products/import, site-images, subscribers
      products/export/route.ts     CSV export
      subscribers/export/route.ts  CSV export
      actions.ts             all admin server actions
    actions.ts               public server actions (subscribe, contact, unsubscribe)
    api/products  api/search  api/unsubscribe     route handlers
    sitemap.ts robots.ts manifest.ts icon.svg apple-icon.tsx opengraph-image.tsx
  components/
    layout/   header, mobile-menu, search-overlay, announcement-bar, footer, nav-data
    home/     hero, marquee, category-bento, featured-carousel, spotlight, sections
    product/  product-card, product-browser, filters, product-gallery, buy-bar, price,
              wishlist-button, collection-hero
    sponsorship/ academy-view, player-view, before-after (image comparison slider)
    forms/    contact-form, newsletter-form, newsletter-popup
    admin/    product-editor, resize-image (in-browser resize before upload)
    ui/       primitives (Button, ButtonLink, SectionHeading…), cards, logo, json-ld,
              legal-page, share-buttons, social-icons
  animations/ gsap.ts (plugin registration + reducedMotion()), motion.tsx (Reveal, SplitReveal…)
  data/       site.ts, categories.ts, technologies.ts, athletes.ts, sponsorships.ts, news.ts,
              products.seed.json, products.ts, site-image-slots.ts
  lib/
    types.ts, catalog.ts (static content getters), products.ts (cached product getters),
    product-query.ts (search/filter/sort), shopify.ts (store parsing), csv.ts, og.tsx,
    site-images.ts, wishlist.ts, use-focus-trap.ts, utils.ts
    server/   env.ts, supabase.ts, products-db.ts, site-images-db.ts, admin-auth.ts,
              rate-limit.ts, request.ts, images.ts, newsletter.ts, resend.ts
supabase/migrations/0001_init.sql
scripts/  migrate.mjs, import-store.mjs, import-diadem.mjs, brand-images.mjs (downloads Diadem photography)
public/images/brand/  self-hosted Diadem brand photos (hero slides, banners, athletes, stories)
```

Every file under `lib/server/` starts with `import "server-only"`.

---

## 3. Design system (frontend look & feel)

**Mood:** bold, athletic, editorial — dark ink sections, huge condensed uppercase headlines, teal brand
accents, mono "eyebrow" labels, generous whitespace.

Tokens (Tailwind v4 `@theme` in `globals.css`), brand colours from diademsports.com:

```
brand #008C95   brand-deep #006A71   brand-bright #3FC3CB   brand-wash #E6F4F5   accent #FF9B2C
ink #0B0B0C  ink-2 #16181A  ink-3 #202223  body #3B3F43  muted #6B7075  line #E3E5E7  mist #F3F5F6  paper #FFF
--text-giant: clamp(5rem, 18vw, 18rem)     --ease-out-expo: cubic-bezier(0.16,1,0.3,1)
```

Custom utilities: `font-display` (Archivo at 72% width, 800 weight, uppercase, tight leading), `eyebrow`
(mono, 0.72rem, wide tracking, uppercase), `text-outline` (stroked text), `container-x` (88rem max, responsive
padding), `clip-angle` (slanted parallelogram), `no-scrollbar`, marquee + fade-in keyframes.
Focus ring: 2px brand-bright (brand-deep on light backgrounds). Selection colour: brand.

**Motion (GSAP):**
- A tiny inline script in `<head>` runs before paint: adds `.js` to `<html>` and sets
  `data-motion="reduce"` when the OS asks for reduced motion **or** the URL has `?motion=reduce`
  (remembered for the tab in sessionStorage; `?motion=full` clears it).
- `Reveal` (fade + lift on scroll), `SplitReveal` (masked line-by-line headline via SplitText, after
  `document.fonts.ready`), parallax/hero effects. Every animation checks `reducedMotion()` and just shows
  the element instead. Elements are only hidden when JS is present, so no-JS users see everything.

---

## 4. Pages and features (frontend)

**Global shell (`(site)/layout.tsx`):** skip-to-content link, rotating announcement bar, sticky header with
one dropdown per stocked collection (links per product type, e.g. `/category/tennis-rackets?type=…`) plus a
"Discover" mega-menu, a "Shop at United Sports" button, search overlay, wishlist count, mobile menu with focus
trap; footer with store details, socials, newsletter form, legal links; delayed newsletter popup (shows once,
remembered in localStorage); Organization JSON-LD.

**Home:** hero (admin-replaceable background) with brand pillars → marquee → "Find your game" category bento
with live product counts → "Players' picks" featured carousel (snap scrolling) → two product spotlights →
latest stories → technology showcase → brand story → sponsorship section (academy + featured junior) →
Team Diadem athletes strip → United Sports retailer banner. `revalidate = 3600`.

**Collections** (`src/data/categories.ts`): Tennis Rackets, Pickleball, Strings, Shoes & Apparel,
Accessories, Bags. Each has name, tagline, description, sport, ordered product `types`, art, optional
`comingSoon` (empty state + newsletter signup).

**Product listing** (`/products`, `/category/[slug]`): server-rendered from URL search params
(`parseQuery` → `applyQuery`): text search, category, type, sport, in-stock, sold-locally, price, sort.
Filters update the URL so results are shareable and indexable. `loading.tsx` skeleton.

**Product page:** image gallery, name, type, price with compare-at/sale price (LKR), stock and variants,
description, features, spec table, what's included, ideal for, linked technologies, related + complementary
products, sticky mobile **buy bar**, wishlist button, share buttons, Product JSON-LD, dynamic OG image.
Products with an **empty `retailerUrl`** (the "dd-" Diadem-range items not sold locally) show **no price and
no Buy button** — information + wishlist only.

**Buy links:** `retailerUrl` + `utm_source/utm_medium=referral/utm_campaign/utm_content` so United Sports
can measure traffic from this site.

**Content pages (static data in `src/data/`):** The Diadem Story, Technologies (Kraibon, FS3, eTPU, HMT
carbon, etc. — each with source + verified flag), Athletes (Team Diadem with country, tour, highlight, bio,
source), Stories/News (block-based articles: paragraph, heading, list, quote, callout, embedded product row;
reading time computed), About (United Sports history + founder quote), Contact (form + two stores, map links),
Privacy, Terms (Sri Lanka PDPA-aware).

**Sponsorship:** an academy page (story, founder, mission, pillars, facilities, before/after slider,
timeline) and a sponsored junior page (coach, ranking, bio, kit linked to products, results by year). While
`isSample: true`: orange "Sample content" badge and `robots: noindex`. For juniors publish sporting info only
(no DOB, school, address, contact details) and require written parental consent.

**Wishlist:** client-only, stored in localStorage (`ds-wishlist`), synced across components and tabs with
`useSyncExternalStore` + a custom event; `/wishlist` fetches product details from `/api/products`.

**Search overlay:** debounced calls to `/api/search?q=` (max 80 chars, returns 8 results, featured products
when empty; cached 60s browser / 300s CDN).

**SEO:** per-page metadata with title template `%s | Diadem Sri Lanka`, canonical URLs, `en_LK` locale,
`sitemap.ts` (static pages, collections, products with images, articles, non-sample sponsorships),
`robots.ts`, web manifest, SVG icon + generated apple icon, generated OG images, JSON-LD.

---

## 5. Data model and backend

### 5.1 Product type (`src/lib/types.ts`)

```ts
interface Product {
  id; slug; name; category: CategorySlug; type; sport: "tennis"|"pickleball"|"all";
  shortDescription; description: string[]; features: string[]; specs: {label,value}[];
  included: string[]; idealFor: string[]; technologies: string[];   // technology slugs
  price: number; compareAtPrice: number|null; inStock: boolean;
  variants: {name, available}[]; images: {src, alt, width?, height?}[];
  retailerHandle; retailerUrl;                                       // empty url = not sold locally
  featured; featuredRank: number|null; spotlight; published; tags: string[];
}
```

### 5.2 Database schema (`supabase/migrations/0001_init.sql`)

- `products` — columns mirror the type above (snake_case; arrays/objects as `jsonb` or `text[]`,
  prices `numeric(12,2)`), indexes on `category` and `published`.
- `subscribers` — id (uuid), email (unique on `lower(email)`), name, source, status
  (`active`/`unsubscribed`), `unsubscribe_token` (uuid, unique), `resend_contact_id`, timestamps.
- `site_images` — `key` (slot id) → `src`, `alt`. A missing row means "use the bundled default".
- `rate_limits` + `hit_rate_limit(key, limit, window_seconds)` — a `security definer` plpgsql function doing
  an atomic upsert-and-count; execute granted to `service_role` only.
- Public storage buckets `product-images` and `site-images` (public read; writes only from the server).
- **RLS enabled on every table with no policies** → only the service-role key (server) can read/write.

### 5.3 Migration + seeding (`scripts/migrate.mjs`)

Runs before `dev` (`--soft`: warn and continue) and `build` (fail hard). Loads `.env.local` via
`process.loadEnvFile`. If `SUPABASE_DB_URL` is missing it skips and the site uses bundled data. Applies
`supabase/migrations/*.sql` in order, tracking applied files in `public._app_migrations`. On an empty
`products` table it seeds from `products.seed.json`, fetching live photos/prices/stock from
`unitedsports.lk/products/<handle>.json`. Later product batches are listed in `SEED_BATCHES` (each runs once,
inserts only missing ids, never re-adds products an admin deleted). **Adding to the JSON alone does not
update a live database — add a batch.**

### 5.4 Data access

- `lib/products.ts`: `unstable_cache` (1 hour, tag `products`) reads the DB and falls back to the bundled
  seed if the DB is empty/unavailable. Public getters filter `published`. Helpers: by slug, category,
  technology, featured (by rank), spotlights, related (same category/type), complementary (other categories).
- Admin mutations call `updateTag("products")` + `revalidatePath("/", "layout")` so changes are live immediately.
- `lib/catalog.ts`: synchronous getters for static content (categories, technologies, athletes, articles,
  sponsorships).
- `lib/site-images.ts`: `getSiteImageOverride(key)` / `getSiteImage(key)` read `site_images` (cached),
  slots defined in `data/site-image-slots.ts` (logo, retailer logo, home hero, category tiles, collection
  banners, About header, athlete portraits, story covers).
- `lib/server/env.ts`: reads all env vars once, exposes `hasSupabase()`, `hasResend()`, `hasAdmin()`.
- `lib/server/supabase.ts`: returns a singleton service-role client or `null` when unconfigured.

### 5.5 Product importers

- `scripts/import-store.mjs`: reads public `unitedsports.lk/products.json`, keeps Diadem products,
  parses the HTML description into description/features/spec table, classifies category/type/sport from
  title + tags, drops rating rows and placeholders, writes `src/data/products.seed.json`.
- `scripts/import-diadem.mjs`: imports Diadem-range products not sold in Sri Lanka from diademsports.com
  as info-only entries (ids prefixed `dd-`, empty `retailerUrl`).
- `lib/shopify.ts`: shared parsing (`parseListingHtml`, `classifyListing`, `imagesFromShopify`, `pricing`,
  `productFromShopify`, `fetchStoreProduct`) used by the admin "Load from store" and "Sync all photos".

### 5.6 Public server actions (`src/app/actions.ts`)

All validated with Zod, rate-limited per client IP, with a hidden honeypot field:
- `subscribeAction` — upserts subscriber (new / already / resubscribed), adds the contact to Resend (and
  segment if configured), sends a welcome email with `List-Unsubscribe` + `List-Unsubscribe-Post` headers.
- `contactAction` — sends the message via Resend to `CONTACT_TO` with reply-to set to the visitor.
- `setSubscriptionAction` + `/unsubscribe?token=` + `/api/unsubscribe` — one-click unsubscribe/resubscribe by
  token (also supports `List-Unsubscribe` one-click POST).
Return a typed `FormState` used with React 19 `useActionState`.

### 5.7 Admin (`/admin`)

- **Auth:** single admin from env (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). Credentials compared in constant time
  (SHA-256 then `timingSafeEqual`). Session = `base64url(payload).HMAC-SHA256` signed with
  `ADMIN_SESSION_SECRET`, 8-hour expiry, `httpOnly`, `secure` in production, `sameSite=lax` cookie
  `ds_admin`. `requireAdmin()` at the top of **every** admin page, route and server action. Login is
  rate-limited. `/admin/*` sends `X-Robots-Tag: noindex, nofollow`.
- **Products:** search/filter list; full editor for every field; publish/hide; delete; drag-and-drop photo
  upload (resized in the browser first, then re-encoded by sharp); add photo by URL; "Load from store" by
  handle; reorder photos; set main photo; alt text; feature/spotlight flags; **Sync all photos** (refresh
  photos, prices, stock for all products from unitedsports.lk); **Import CSV** (Shopify export or the site's
  own template) and **Export CSV**; restore seed.
- **Site images:** upload/replace/reset each slot (logos keep PNG transparency).
- **Subscribers:** list, search, filter by status, CSV export.
- **Uploads (`lib/server/images.ts`):** max 5.5 MB, format sniffed by sharp (JPEG/PNG/WebP/AVIF/HEIF only),
  auto-rotate, resize, re-encode to WebP (q84) which strips EXIF/GPS, random UUID file names, stored in the
  Supabase bucket. `serverActions.bodySizeLimit: "6mb"`.

### 5.8 Security headers (`next.config.ts`)

`poweredByHeader: false`; on all routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
`Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, HSTS (2 years,
preload), `Cross-Origin-Opener-Policy: same-origin`. Image `remotePatterns`: cdn.shopify.com,
unitedsports.lk `/cdn/**`, `*.supabase.co/storage/v1/object/public/**`.

---

## 6. Environment variables (`.env.example` → `.env.local`, never committed)

```
NEXT_PUBLIC_SITE_URL=https://diademsports.lk
SUPABASE_URL=            SUPABASE_SERVICE_ROLE_KEY=      SUPABASE_DB_URL=   (session pooler, migrations only)
RESEND_API_KEY=          RESEND_FROM=                    RESEND_SEGMENT_ID= (optional)   CONTACT_TO=
ADMIN_EMAIL=             ADMIN_PASSWORD=                 ADMIN_SESSION_SECRET= (32+ random chars)
```

---

## 7. Deployment

1. Push to a private GitHub repo.
2. Netlify → Import from Git; build settings come from `netlify.toml` (`npm run build`, Node 22,
   `@netlify/plugin-nextjs`, telemetry off).
3. Add every env var in Netlify site settings.
4. Point the `diademsports.lk` domain at Netlify; verify the domain in Resend (DNS records) for email.
5. Supabase project in a region near Sri Lanka (e.g. Singapore). The build runs migrations automatically.

---

## 8. Build order (if starting from scratch)

1. `create-next-app` (TypeScript, App Router, Tailwind v4, ESLint); add dependencies above.
2. Design tokens, fonts, utilities, primitives (Button, SectionHeading, cards, Logo).
3. Types + static content files in `src/data/` (site details, categories, technologies, athletes, news,
   sponsorships) from verified sources.
4. Store importer → `products.seed.json`; `lib/products.ts` reading the seed.
5. Site shell: announcement bar, header + menus, search overlay, footer.
6. Product card, listing with URL-driven filters, collection pages, product page with buy bar.
7. Home page sections, then all content pages.
8. GSAP motion layer with reduced-motion support.
9. Supabase schema + `migrate.mjs`; switch `lib/products.ts` to DB-with-fallback + caching.
10. Admin auth, product editor, uploads, site images, CSV import/export, subscribers.
11. Resend: newsletter, popup, contact form, unsubscribe flow, rate limiting + honeypots.
12. SEO (metadata, sitemap, robots, OG images, JSON-LD, manifest, icons) and security headers.
13. Placeholder SVG art generator; legal pages; README operating manual.
14. Verify: `npm run check`, `npm run build`, then `next start -p 3100` and click through every page,
    test keyboard navigation, `?motion=reduce`, and 2–3 Buy-now links.

---

## 9. Working conventions on the existing project

- The owner's dev server runs on port **3000** and shares `.next/` — **never delete `.next` while it runs**.
  Verify with `npm run build` + `next start -p 3100`, then ask the owner to restart their server after large
  changes (Tailwind class changes sometimes need a restart).
- Static content edits go in `src/data/*.ts`; new products for a live database go through `SEED_BATCHES`
  in `scripts/migrate.mjs` or the admin panel.
- Keep the README checklist current. Open items: real sponsorship content (currently samples), store
  opening hours, which contact email to use (`unitedsports@sltnet.lk` vs `info@unitedsports.lk`), official
  Diadem logo, real athlete portraits, sponsorship stats, legal review of Privacy/Terms.
- Facts and sources: products → unitedsports.lk; brand story, technologies, athletes → diademsports.com;
  United Sports history → unitedsports.lk/pages/united-sports.
