"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { seedProducts } from "@/data/products";
import { site } from "@/data/site";
import { logoSlotKeys, slotByKey } from "@/data/site-image-slots";
import { getCategory } from "@/lib/catalog";
import { parseCsvObjects } from "@/lib/csv";
import { PRODUCTS_TAG } from "@/lib/products";
import { checkCredentials, clearSessionCookie, requireAdmin, setSessionCookie } from "@/lib/server/admin-auth";
import { hasAdmin, hasSupabase } from "@/lib/server/env";
import { uploadToBucket } from "@/lib/server/images";
import { dbDeleteProduct, dbGetProduct, dbListProducts, dbUpsertProduct, dbUpsertProducts } from "@/lib/server/products-db";
import { rateLimit } from "@/lib/server/rate-limit";
import { clientIp } from "@/lib/server/request";
import { dbDeleteSiteImage, dbUpsertSiteImage } from "@/lib/server/site-images-db";
import { PRODUCT_BUCKET, SITE_BUCKET } from "@/lib/server/supabase";
import { SITE_IMAGES_TAG } from "@/lib/site-images";
import { fetchStoreProduct, imagesFromShopify, pricing, productFromShopify } from "@/lib/shopify";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

export interface ActionResult {
  ok: boolean;
  message: string;
}

function refreshProducts() {
  updateTag(PRODUCTS_TAG);
  revalidatePath("/", "layout");
}

function refreshSiteImages() {
  updateTag(SITE_IMAGES_TAG);
  revalidatePath("/", "layout");
}

const fail = (err: unknown): ActionResult => ({ ok: false, message: err instanceof Error ? err.message : "Something went wrong." });

/* ------------------------------------------------------------------ auth */

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!hasAdmin()) {
    return { ok: false, message: "Admin login isn't set up. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ characters) to .env.local." };
  }
  const ip = await clientIp();
  if (!(await rateLimit(`admin-login:${ip}`, 5, 900))) {
    return { ok: false, message: "Too many attempts. Please wait 15 minutes and try again." };
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(email, password)) return { ok: false, message: "Incorrect email or password." };
  await setSessionCookie(email.trim().toLowerCase());
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* -------------------------------------------------------------- products */

const imageSchema = z.object({
  src: z.string().trim().min(1).max(1000),
  alt: z.string().trim().max(300).default(""),
  width: z.number().optional(),
  height: z.number().optional(),
});

const productSchema = z.object({
  id: z.string().trim().min(1).max(80),
  slug: z
    .string()
    .trim()
    .min(1, "URL slug is required.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL slug can only use lowercase letters, numbers and dashes."),
  name: z.string().trim().min(2, "Name is required.").max(200),
  category: z.string().refine((c) => Boolean(getCategory(c)), "Choose a valid collection."),
  type: z.string().trim().max(60),
  sport: z.enum(["tennis", "pickleball", "all"]),
  shortDescription: z.string().trim().max(600),
  description: z.array(z.string().trim().max(3000)).max(20),
  features: z.array(z.string().trim().max(300)).max(30),
  specs: z.array(z.object({ label: z.string().trim().min(1).max(80), value: z.string().trim().min(1).max(200) })).max(40),
  included: z.array(z.string().trim().max(200)).max(20),
  idealFor: z.array(z.string().trim().max(400)).max(20),
  technologies: z.array(z.string().trim().max(60)).max(20),
  price: z.number().min(0).max(10_000_000),
  compareAtPrice: z.number().min(0).max(10_000_000).nullable(),
  inStock: z.boolean(),
  variants: z.array(z.object({ name: z.string().trim().min(1).max(100), available: z.boolean() })).max(50),
  images: z.array(imageSchema).max(20),
  retailerHandle: z.string().trim().max(200),
  retailerUrl: z
    .string()
    .trim()
    .max(500)
    .refine((u) => u === "" || /^https:\/\//.test(u), "Retailer URL must start with https://"),
  featured: z.boolean(),
  featuredRank: z.number().int().min(0).max(99).nullable(),
  spotlight: z.boolean(),
  published: z.boolean(),
  tags: z.array(z.string().trim().max(60)).max(50),
});

export async function saveProductAction(payload: string): Promise<ActionResult & { id?: string }> {
  await requireAdmin();
  try {
    const parsed = productSchema.safeParse(JSON.parse(payload));
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
    const p = parsed.data as Product;
    p.description = p.description.filter(Boolean);
    p.features = p.features.filter(Boolean);
    p.included = p.included.filter(Boolean);
    p.idealFor = p.idealFor.filter(Boolean);
    await dbUpsertProduct(p);
    refreshProducts();
    return { ok: true, message: "Saved — the change is live.", id: p.id };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await dbDeleteProduct(id);
    refreshProducts();
  } catch (err) {
    return fail(err);
  }
  redirect("/admin/products?deleted=1");
}

export async function togglePublishAction(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    const p = await dbGetProduct(id);
    if (!p) return { ok: false, message: "Product not found." };
    await dbUpsertProduct({ ...p, published });
    refreshProducts();
    return { ok: true, message: published ? "Published." : "Hidden from the site." };
  } catch (err) {
    return fail(err);
  }
}

/** Uploads one photo for a product (resized/stripped server-side) and returns its public URL. */
export async function uploadProductImageAction(formData: FormData): Promise<ActionResult & { url?: string }> {
  await requireAdmin();
  try {
    const productId = String(formData.get("productId") ?? "new");
    const url = await uploadToBucket(PRODUCT_BUCKET, productId, formData.get("file") as File, { maxWidth: 1800 });
    return { ok: true, message: "Uploaded.", url };
  } catch (err) {
    return fail(err);
  }
}

/** Fetches photos, price and stock for one product from the retailer store. */
export async function loadFromStoreAction(handle: string) {
  await requireAdmin();
  const p = await fetchStoreProduct(site.retailer.url, handle.trim());
  if (!p) return { ok: false as const, message: `Couldn't find "${handle}" on ${site.retailer.host}.` };
  return { ok: true as const, message: `Loaded ${p.images.length} photo(s) from ${site.retailer.host}.`, images: imagesFromShopify(p), ...pricing(p) };
}

/** Refreshes photos, price and stock for every product from the retailer store. */
export async function syncAllPhotosAction(): Promise<ActionResult> {
  await requireAdmin();
  try {
    const list = await dbListProducts();
    if (!list) return { ok: false, message: "Database is not configured." };
    let updated = 0;
    const missing: string[] = [];
    const next: Product[] = [];
    for (const p of list) {
      if (!p.retailerHandle) continue;
      const live = await fetchStoreProduct(site.retailer.url, p.retailerHandle);
      if (!live) {
        missing.push(p.name);
        continue;
      }
      const pr = pricing(live);
      next.push({ ...p, images: imagesFromShopify(live), price: pr.price, compareAtPrice: pr.compareAtPrice, inStock: pr.inStock, variants: pr.variants });
      updated++;
    }
    if (next.length) await dbUpsertProducts(next);
    refreshProducts();
    return {
      ok: true,
      message: `Synced ${updated} product(s) from ${site.retailer.host}.${missing.length ? ` Not found in store: ${missing.join(", ")}.` : ""}`,
    };
  } catch (err) {
    return fail(err);
  }
}

/** Imports a CSV — either a Shopify product export or this site's own template. */
export async function importCsvAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    if (!hasSupabase()) return { ok: false, message: "Database is not configured." };
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) return { ok: false, message: "Choose a CSV file first." };
    if (file.size > 5 * 1024 * 1024) return { ok: false, message: "CSV is too large (max 5 MB)." };
    const rows = parseCsvObjects(await file.text());
    if (!rows.length) return { ok: false, message: "The CSV has no rows." };
    const existing = (await dbListProducts()) ?? [];
    const products = "Handle" in rows[0] ? fromShopifyCsv(rows, existing, formData.get("diademOnly") === "on") : fromTemplateCsv(rows, existing);
    if (!products.length) return { ok: false, message: "No products found in that CSV." };
    await dbUpsertProducts(products);
    refreshProducts();
    return { ok: true, message: `Imported ${products.length} product(s).` };
  } catch (err) {
    return fail(err);
  }
}

const list = (v: string | undefined) =>
  (v ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
const bool = (v: string | undefined, d: boolean) => (v == null || v === "" ? d : /^(true|yes|1|y)$/i.test(v));
const num = (v: string | undefined) => (v && !Number.isNaN(Number(v.replace(/[^\d.]/g, ""))) ? Number(v.replace(/[^\d.]/g, "")) : null);

function uniqueSlug(base: string, taken: Set<string>) {
  let s = base || "product";
  let i = 2;
  while (taken.has(s)) s = `${base}-${i++}`;
  taken.add(s);
  return s;
}

function fromTemplateCsv(rows: Record<string, string>[], existing: Product[]): Product[] {
  const taken = new Set(existing.map((p) => p.slug));
  return rows
    .filter((r) => r.name)
    .map((r) => {
      const prev = existing.find((p) => p.id === r.id || p.slug === r.slug);
      if (prev) taken.delete(prev.slug);
      const slug = uniqueSlug(slugify(r.slug || r.name), taken);
      const alts = list(r.image_alts);
      const category = getCategory(r.category) ? (r.category as Product["category"]) : (prev?.category ?? "accessories");
      return {
        id: r.id || prev?.id || `p-${slug}`,
        slug,
        name: r.name,
        category,
        type: r.type || prev?.type || "",
        sport: (["tennis", "pickleball", "all"].includes(r.sport) ? r.sport : (prev?.sport ?? "all")) as Product["sport"],
        shortDescription: r.short_description ?? prev?.shortDescription ?? "",
        description: list(r.description),
        features: list(r.features),
        specs: list(r.specs)
          .map((s) => {
            const i = s.indexOf(":");
            return i > 0 ? { label: s.slice(0, i).trim(), value: s.slice(i + 1).trim() } : null;
          })
          .filter((s): s is { label: string; value: string } => Boolean(s?.label && s.value)),
        included: list(r.included),
        idealFor: list(r.ideal_for),
        technologies: list(r.technologies),
        price: num(r.price) ?? prev?.price ?? 0,
        compareAtPrice: num(r.compare_at_price),
        inStock: bool(r.in_stock, true),
        variants: list(r.variants).map((v) => ({ name: v.replace(/\s*\(sold out\)$/i, ""), available: !/\(sold out\)$/i.test(v) })),
        images: list(r.images).map((src, i) => ({ src, alt: alts[i] ?? (i === 0 ? r.name : `${r.name} — view ${i + 1}`) })),
        retailerHandle: r.retailer_handle ?? prev?.retailerHandle ?? "",
        retailerUrl: r.retailer_url || prev?.retailerUrl || "",
        featured: bool(r.featured, false),
        featuredRank: num(r.featured_rank),
        spotlight: bool(r.spotlight, false),
        published: bool(r.published, true),
        tags: list(r.tags),
      };
    });
}

function fromShopifyCsv(rows: Record<string, string>[], existing: Product[], diademOnly: boolean): Product[] {
  const groups = new Map<string, Record<string, string>[]>();
  for (const r of rows) {
    if (!r.Handle) continue;
    groups.set(r.Handle, [...(groups.get(r.Handle) ?? []), r]);
  }
  const taken = new Set(existing.map((p) => p.slug));
  const out: Product[] = [];
  for (const [handle, g] of groups) {
    const head = g.find((r) => r.Title) ?? g[0];
    if (diademOnly && !/diadem/i.test(`${head.Vendor} ${head.Title}`)) continue;
    const prev = existing.find((p) => p.retailerHandle === handle);
    if (prev) taken.delete(prev.slug);
    const images = g
      .filter((r) => r["Image Src"])
      .sort((a, b) => Number(a["Image Position"] || 0) - Number(b["Image Position"] || 0))
      .map((r) => ({ src: r["Image Src"] }));
    const variants = g
      .filter((r) => r["Variant Price"])
      .map((r) => ({
        title: [r["Option1 Value"], r["Option2 Value"], r["Option3 Value"]].filter(Boolean).join(" / ") || "Default Title",
        price: r["Variant Price"],
        compare_at_price: r["Variant Compare At Price"] || null,
        available: r["Variant Inventory Qty"] ? Number(r["Variant Inventory Qty"]) > 0 : true,
      }));
    const base = productFromShopify(
      {
        id: 0,
        title: head.Title,
        handle,
        body_html: head["Body (HTML)"] ?? "",
        tags: (head.Tags ?? "").split(",").map((t) => t.trim()),
        images,
        variants: variants.length ? variants : [{ title: "Default Title", price: "0", compare_at_price: null }],
      },
      site.retailer.url,
      prev?.slug ?? uniqueSlug(slugify(head.Title), taken),
    );
    out.push({
      ...base,
      id: prev?.id ?? `shopify-${handle}`,
      technologies: prev?.technologies ?? [],
      featured: prev?.featured ?? false,
      featuredRank: prev?.featuredRank ?? null,
      spotlight: prev?.spotlight ?? false,
      published: head.Published ? bool(head.Published, true) : (prev?.published ?? true),
    });
  }
  return out;
}

/** Re-seeds the database from the bundled catalogue (only adds products that are missing). */
export async function restoreSeedAction(): Promise<ActionResult> {
  await requireAdmin();
  try {
    const existing = (await dbListProducts()) ?? [];
    const missing = seedProducts.filter((s) => !existing.some((e) => e.id === s.id));
    if (missing.length) await dbUpsertProducts(missing);
    refreshProducts();
    return { ok: true, message: missing.length ? `Restored ${missing.length} product(s).` : "Nothing to restore." };
  } catch (err) {
    return fail(err);
  }
}

/* ----------------------------------------------------------- site images */

export async function uploadSiteImageAction(formData: FormData): Promise<ActionResult & { url?: string }> {
  await requireAdmin();
  try {
    const key = String(formData.get("key") ?? "");
    if (!slotByKey.has(key)) return { ok: false, message: "Unknown image slot." };
    const isLogo = logoSlotKeys.has(key);
    const url = await uploadToBucket(SITE_BUCKET, key, formData.get("file") as File, { maxWidth: isLogo ? 1200 : 2600, keepPng: isLogo });
    const alt = String(formData.get("alt") ?? "").trim().slice(0, 300) || slotByKey.get(key)!.defaultAlt || slotByKey.get(key)!.label;
    await dbUpsertSiteImage(key, url, alt);
    refreshSiteImages();
    return { ok: true, message: "Uploaded — it's live now.", url };
  } catch (err) {
    return fail(err);
  }
}

const siteImageSchema = z.object({
  key: z.string().refine((k) => slotByKey.has(k), "Unknown image slot."),
  src: z
    .string()
    .trim()
    .max(1000)
    .refine((u) => /^https:\/\//.test(u) || u.startsWith("/"), "Image URL must start with https:// (or / for a file in the site)."),
  alt: z.string().trim().max(300),
});

export async function saveSiteImageAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = siteImageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the fields." };
  try {
    await dbUpsertSiteImage(parsed.data.key, parsed.data.src, parsed.data.alt);
    refreshSiteImages();
    return { ok: true, message: "Saved — it's live now." };
  } catch (err) {
    return fail(err);
  }
}

export async function resetSiteImageAction(key: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    if (!slotByKey.has(key)) return { ok: false, message: "Unknown image slot." };
    await dbDeleteSiteImage(key);
    refreshSiteImages();
    return { ok: true, message: "Reset to the original." };
  } catch (err) {
    return fail(err);
  }
}
