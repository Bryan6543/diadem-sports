/**
 * Resizes an image in the browser before upload so large phone photos upload quickly.
 * The server re-encodes again (stripping EXIF/GPS), so this is purely a speed-up.
 */
export async function resizeInBrowser(file: File, maxWidth = 2400, keepPng = false): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxWidth / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const type = keepPng && file.type === "image/png" ? "image/png" : "image/webp";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.9));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, type === "image/png" ? ".png" : ".webp"), { type });
  } catch {
    return file;
  }
}
