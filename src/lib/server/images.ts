import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getSupabase } from "./supabase";

const MAX_BYTES = 5.5 * 1024 * 1024;

/**
 * Validates and re-encodes an uploaded image, which strips EXIF/GPS metadata,
 * applies camera rotation and resizes for the web. Logos keep PNG transparency.
 */
export async function processUpload(file: File, opts: { maxWidth: number; keepPng?: boolean }) {
  if (!(file instanceof File) || file.size === 0) throw new Error("No file received.");
  if (file.size > MAX_BYTES) throw new Error("That file is too large (max 5.5 MB).");
  const input = Buffer.from(await file.arrayBuffer());
  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new Error("That file isn't a supported image (use JPEG, PNG, WebP or AVIF).");
  }
  if (!meta.format || !["jpeg", "png", "webp", "avif", "heif"].includes(meta.format)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, WebP or AVIF.");
  }
  const base = sharp(input).rotate().resize({ width: opts.maxWidth, withoutEnlargement: true });
  // sharp drops all metadata (EXIF, GPS, XMP) unless .withMetadata() is called.
  if (opts.keepPng && meta.format === "png") {
    return { buffer: await base.png({ compressionLevel: 9 }).toBuffer(), ext: "png", contentType: "image/png" };
  }
  return { buffer: await base.webp({ quality: 84 }).toBuffer(), ext: "webp", contentType: "image/webp" };
}

export async function uploadToBucket(bucket: string, folder: string, file: File, opts: { maxWidth: number; keepPng?: boolean }) {
  const db = getSupabase();
  if (!db) throw new Error("Image uploads need the database (Supabase) to be configured.");
  const { buffer, ext, contentType } = await processUpload(file, opts);
  const safeFolder = folder.replace(/[^a-z0-9._-]/gi, "-").slice(0, 80) || "misc";
  const path = `${safeFolder}/${randomUUID()}.${ext}`;
  const { error } = await db.storage.from(bucket).upload(path, buffer, { contentType, upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
