# Diadem Sri Lanka — diademsports.lk

A brand showcase and product-discovery site for **Diadem** in Sri Lanka, run by **United Sports (Pvt) Ltd**.
There is no cart: every **Buy now** button opens the exact product on **unitedsports.lk**, where the purchase happens.

```
showcase → product discovery → product page → BUY NOW → unitedsports.lk product → cart → checkout
```

The site works straight away with the bundled product data (31 Diadem products imported from unitedsports.lk).
Connecting Supabase and Resend switches on the admin editing, photo uploads, newsletter and contact form.

---

## 1. Run it on your computer

You need **Node.js 22 or newer** (you have it).

```bash
npm install          # first time only
npm run dev          # start the site while making changes
```

Open **http://localhost:3000**. If something else already uses port 3000 (for example another project), run
`npm run dev -- -p 3100` and open http://localhost:3100 instead.

> **Seeing old content?** `npm run dev` shows changes instantly. A production server (`npm start`) only shows
> changes after `npm run build`. If a styling change doesn't appear in dev, stop the server (Ctrl+C) and start it again.

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site for editing (also updates the database if connected) |
| `npm run build` | Build the production version (also updates the database) |
| `npm run check` | Check the code for errors (typecheck + lint) |
| `npm run import:store` | Re-import every Diadem product from unitedsports.lk into the bundled data |
| `npm run import:diadem` | Re-import the Diadem products United Sports doesn't sell (from diademsports.com) as information pages — no price, no Buy button |
| `npm run images` | Re-download the Diadem brand photos (`public/images/brand/`) and the trimmed store photos (`public/images/store/`) |
| `npm run migrate` | Apply database changes manually |

---

## 2. Settings file (`.env.local`)

Copy `.env.example` to a new file called **`.env.local`** in the same folder and fill in the values as you go
through the steps below. **Never share this file or paste it into chat or email.**

---

## 3. Supabase (database + photo storage)

1. Create a free project at **supabase.com**. Choose a region close to Sri Lanka (e.g. Singapore) and a **strong,
   unique database password** (different from the admin password).
2. **Project Settings → API**: copy the *Project URL* into `SUPABASE_URL` and the *service_role* key into
   `SUPABASE_SERVICE_ROLE_KEY`.
3. **Project Settings → Database → Connection string → Session pooler**: copy it into `SUPABASE_DB_URL`
   (replace `[YOUR-PASSWORD]` with your database password).
4. Run `npm run dev`. The site creates its tables automatically, then loads the 31 products with their live photos
   from unitedsports.lk. You'll see `[migrate] database is up to date`.

Security: every table has row-level security switched on with no public access — only the website's server can
read or write.

## 4. Resend (emails)

1. Create an account at **resend.com** and **verify the domain** `diademsports.lk` (Resend shows the DNS records to add).
2. Create an API key → `RESEND_API_KEY`.
3. Set `RESEND_FROM`, e.g. `Diadem Sri Lanka <hello@diademsports.lk>`.
4. Optional: create a segment for newsletter contacts and put its id in `RESEND_SEGMENT_ID`.
5. `CONTACT_TO` is where contact-form messages go (defaults to unitedsports@sltnet.lk).

Until Resend is set up, the forms show a friendly "temporarily unavailable" message.

## 5. Admin login

Set in `.env.local`:

- `ADMIN_EMAIL` — your email
- `ADMIN_PASSWORD` — a long, unique password
- `ADMIN_SESSION_SECRET` — 32+ random characters. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`

Restart the server, then go to **/admin**. Sessions last 8 hours. Login attempts are rate-limited.

**In the admin you can:**

- **Products**: search/filter, edit every field, publish/hide, delete, upload photos (drag and drop), add photos by
  URL, *Load from store*, reorder, set the main photo, alt text. **Sync all photos** refreshes photos, prices and
  stock for every product from unitedsports.lk. **Import CSV** (Shopify export or this site's template) and **Export CSV**.
- **Site images**: logo, home hero, category tiles, collection banners, About header, athlete portraits, story covers.
  Uploads are resized and have location (GPS/EXIF) data removed automatically.
- **Subscribers**: list, search, filter and export.

Changes go live immediately after saving.

## 6. Deploy to Netlify

1. Put this folder in a GitHub repository (private is fine).
2. In Netlify: **Add new site → Import from Git**, pick the repository. Settings come from `netlify.toml` (Node 22).
3. **Site settings → Environment variables**: add every value from `.env.local`, and set
   `NEXT_PUBLIC_SITE_URL=https://diademsports.lk`.
4. **Domain management**: add `diademsports.lk` and follow Netlify's DNS instructions.

---

## 7. Before launch — content checklist

Please confirm or supply:

- [ ] **Store opening hours** for Colombo 03 and the SLTA store (not published on unitedsports.lk — currently "please call to confirm").
- [ ] **Contact email**: the site uses `unitedsports@sltnet.lk` (store footer). The contact policy also lists `info@unitedsports.lk` — which should customers use?
- [ ] **Announcement bar** (`src/data/site.ts`): currently "Island-wide delivery across Sri Lanka…". Add 1–2 more true messages if you like.
- [ ] **Diadem logo**: upload the official logo in *Admin → Site images → Logo* (the site uses a text logo until then). Make sure you're permitted to use it.
- [ ] **Sponsorship**: the academy and junior pages are **sample content** with a visible orange "Sample content" badge and are hidden from Google. Send the real material (photos, story, results). For any junior: **written parental consent** is required, and only sporting information is published (no date of birth, school, address, phone, email or ID numbers).
- [ ] **Sponsorship stats** on /sponsorship ("TBC").
- [ ] **Athlete portraits**: placeholders. Only upload photos you have the rights to use (Diadem may supply press images).
- [ ] **Privacy notice and Terms**: review with your legal adviser (Sri Lanka Personal Data Protection Act).
- [ ] **Store listing quirks** carried over from unitedsports.lk you may want to fix there: a "Navy & Glod" colour typo; three string listings have store links ending in `-copy`.
- [ ] Check 2–3 **Buy now** links open the right product on unitedsports.lk.

## Where things are

| What | Where |
| --- | --- |
| Store details, socials, announcement, disclaimer | `src/data/site.ts` |
| Collections | `src/data/categories.ts` |
| Technologies (from diademsports.com) | `src/data/technologies.ts` |
| Team Diadem athletes (from diademsports.com) | `src/data/athletes.ts` |
| Sponsorship (sample) | `src/data/sponsorships.ts` |
| Stories | `src/data/news.ts` |
| Bundled products | `src/data/products.seed.json` (made by `npm run import:store`) |
| Database changes | `supabase/migrations/` |

### Facts and sources

- Products, prices, specs and photos: unitedsports.lk listings (subjective "High / ★★★★★" ratings are not shown).
- Brand story, technologies and athletes: diademsports.com (About us, Team Diadem and product pages), checked 13 October 2026.
- United Sports history and founder quote: unitedsports.lk/pages/united-sports.
- Brand colours: Diadem teal `#008C95`, deep teal `#006A71`, bright teal `#3FC3CB` (from diademsports.com).

### Motion and accessibility

Animations respect the visitor's "reduce motion" setting. For testing, add `?motion=reduce` to any URL
(and `?motion=full` to switch back).
"# diadem-sports" 
