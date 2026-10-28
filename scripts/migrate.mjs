#!/usr/bin/env node
/**
 * Applies supabase/migrations/*.sql in order and seeds the products table on first run.
 * Runs automatically before `npm run dev` (with --soft) and `npm run build`.
 *
 *   node scripts/migrate.mjs          # fail on errors (used by build)
 *   node scripts/migrate.mjs --soft   # warn and continue (used by dev)
 *
 * Needs SUPABASE_DB_URL (Supabase → Project Settings → Database → Session pooler string).
 * Without it, the script skips and the site runs on bundled data.
 * Applied migrations are tracked in public._app_migrations, so re-running is safe.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const soft = process.argv.includes("--soft");
const STORE = "https://www.unitedsports.lk";

for (const f of [".env.local", ".env"]) {
  const p = path.join(root, f);
  if (existsSync(p)) {
    try {
      process.loadEnvFile(p);
    } catch {
      /* ignore malformed env file; values may come from the host */
    }
  }
}

const log = (msg) => console.log(`[migrate] ${msg}`);

async function fetchStoreImages(handle) {
  if (!handle) return null;
  try {
    const res = await fetch(`${STORE}/products/${handle}.json`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const { product } = await res.json();
    const prices = product.variants.map((v) => Number(v.price));
    return {
      images: product.images.slice(0, 8).map((img, i) => ({
        src: img.src,
        alt: i === 0 ? product.title : `${product.title} — view ${i + 1}`,
        width: img.width,
        height: img.height,
      })),
      price: Math.min(...prices),
      inStock: product.variants.some((v) => v.available !== false),
    };
  } catch {
    return null;
  }
}

const readSeed = () => JSON.parse(readFileSync(path.join(root, "src/data/products.seed.json"), "utf8"));

async function seedProducts(client) {
  const { rows } = await client.query("select count(*)::int as n from public.products");
  if (rows[0].n > 0) return;
  const seed = readSeed();
  log(`seeding ${seed.length} products (fetching live photos from ${STORE})…`);
  for (const p of seed) await insertProduct(client, p);
  log("seed complete");
}

/**
 * Product batches added to the bundled catalogue after the first seed. Each runs once (tracked in
 * _app_migrations), inserts only products that aren't in the database yet, and never re-adds
 * products an admin deleted afterwards.
 */
const SEED_BATCHES = [
  { name: "seed:diadem-official-range", match: (p) => p.id.startsWith("dd-") },
  { name: "seed:arriving-elevate-lite-teal", match: (p) => p.id === "dd-7030357426258-teal" },
];

async function seedBatches(client, applied) {
  for (const batch of SEED_BATCHES) {
    if (applied.has(batch.name)) continue;
    const products = readSeed().filter(batch.match);
    log(`adding ${products.length} products (${batch.name})…`);
    await client.query("begin");
    try {
      for (const p of products) await insertProduct(client, p);
      await client.query("insert into public._app_migrations (name) values ($1)", [batch.name]);
      await client.query("commit");
    } catch (err) {
      await client.query("rollback");
      throw new Error(`${batch.name}: ${err.message}`);
    }
  }
}

async function insertProduct(client, p) {
  const live = await fetchStoreImages(p.retailerHandle);
  const images = live?.images?.length ? live.images : p.images;
  await client.query(
    `insert into public.products (id, slug, name, category, type, sport, short_description, description, features, specs,
        included, ideal_for, technologies, price, compare_at_price, in_stock, variants, images, retailer_handle, retailer_url,
        featured, featured_rank, spotlight, published, tags)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
       on conflict do nothing`,
    [
      p.id,
      p.slug,
      p.name,
      p.category,
      p.type,
      p.sport,
      p.shortDescription,
      JSON.stringify(p.description),
      JSON.stringify(p.features),
      JSON.stringify(p.specs),
      JSON.stringify(p.included),
      JSON.stringify(p.idealFor),
      p.technologies,
      live?.price ?? p.price,
      p.compareAtPrice,
      live?.inStock ?? p.inStock,
      JSON.stringify(p.variants),
      JSON.stringify(images),
      p.retailerHandle,
      p.retailerUrl,
      p.featured,
      p.featuredRank,
      p.spotlight,
      p.published,
      p.tags,
    ],
  );
}

async function main() {
  const url = process.env.SUPABASE_DB_URL?.trim();
  if (!url) {
    log("SUPABASE_DB_URL not set — skipping (the site will use bundled data).");
    return;
  }
  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(`create table if not exists public._app_migrations (
      name text primary key, applied_at timestamptz not null default now())`);
    await client.query("alter table public._app_migrations enable row level security");
    const { rows } = await client.query("select name from public._app_migrations");
    const applied = new Set(rows.map((r) => r.name));
    const dir = path.join(root, "supabase/migrations");
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const file of files) {
      if (applied.has(file)) continue;
      log(`applying ${file}`);
      await client.query("begin");
      try {
        await client.query(readFileSync(path.join(dir, file), "utf8"));
        await client.query("insert into public._app_migrations (name) values ($1)", [file]);
        await client.query("commit");
      } catch (err) {
        await client.query("rollback");
        throw new Error(`${file}: ${err.message}`);
      }
    }
    await seedProducts(client);
    await seedBatches(client, applied);
    log("database is up to date");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`[migrate] ${soft ? "warning" : "error"}: ${err.message}`);
  if (!soft) process.exit(1);
});
