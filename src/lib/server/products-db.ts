import "server-only";
import type { Product } from "@/lib/types";
import { getSupabase } from "./supabase";

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: string;
  sport: string;
  short_description: string;
  description: string[];
  features: string[];
  specs: Product["specs"];
  included: string[];
  ideal_for: string[];
  technologies: string[];
  price: number | string;
  compare_at_price: number | string | null;
  in_stock: boolean;
  variants: Product["variants"];
  images: Product["images"];
  retailer_handle: string;
  retailer_url: string;
  featured: boolean;
  featured_rank: number | null;
  spotlight: boolean;
  published: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category as Product["category"],
    type: r.type,
    sport: r.sport as Product["sport"],
    shortDescription: r.short_description,
    description: r.description ?? [],
    features: r.features ?? [],
    specs: r.specs ?? [],
    included: r.included ?? [],
    idealFor: r.ideal_for ?? [],
    technologies: r.technologies ?? [],
    price: Number(r.price),
    compareAtPrice: r.compare_at_price == null ? null : Number(r.compare_at_price),
    inStock: r.in_stock,
    variants: r.variants ?? [],
    images: r.images ?? [],
    retailerHandle: r.retailer_handle,
    retailerUrl: r.retailer_url,
    featured: r.featured,
    featuredRank: r.featured_rank,
    spotlight: r.spotlight,
    published: r.published,
    tags: r.tags ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function productToRow(p: Product): Omit<ProductRow, "created_at" | "updated_at"> {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    type: p.type,
    sport: p.sport,
    short_description: p.shortDescription,
    description: p.description,
    features: p.features,
    specs: p.specs,
    included: p.included,
    ideal_for: p.idealFor,
    technologies: p.technologies,
    price: p.price,
    compare_at_price: p.compareAtPrice,
    in_stock: p.inStock,
    variants: p.variants,
    images: p.images,
    retailer_handle: p.retailerHandle,
    retailer_url: p.retailerUrl,
    featured: p.featured,
    featured_rank: p.featuredRank,
    spotlight: p.spotlight,
    published: p.published,
    tags: p.tags,
  };
}

/** All products including unpublished (admin). Returns null when the database is not configured. */
export async function dbListProducts(): Promise<Product[] | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from("products").select("*").order("category").order("name");
  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(rowToProduct);
}

export async function dbGetProduct(id: string): Promise<Product | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProduct(data as ProductRow) : null;
}

export async function dbUpsertProduct(p: Product) {
  const db = getSupabase();
  if (!db) throw new Error("Database is not configured.");
  const { error } = await db
    .from("products")
    .upsert({ ...productToRow(p), updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) {
    if (error.code === "23505") throw new Error("Another product already uses that URL slug.");
    throw new Error(error.message);
  }
}

export async function dbUpsertProducts(list: Product[]) {
  const db = getSupabase();
  if (!db) throw new Error("Database is not configured.");
  const now = new Date().toISOString();
  const { error } = await db.from("products").upsert(
    list.map((p) => ({ ...productToRow(p), updated_at: now })),
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export async function dbDeleteProduct(id: string) {
  const db = getSupabase();
  if (!db) throw new Error("Database is not configured.");
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
