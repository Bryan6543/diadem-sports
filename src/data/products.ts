import type { Product } from "@/lib/types";
import seed from "./products.seed.json";

/**
 * Bundled catalogue — imported from the United Sports store with `node scripts/import-store.mjs`.
 * Used to seed the database on first run, and as the fallback whenever the database is unavailable.
 */
export const seedProducts = seed as unknown as Product[];
