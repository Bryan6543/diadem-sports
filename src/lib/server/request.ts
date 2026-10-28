import "server-only";
import { headers } from "next/headers";

/** Best-effort client IP (Netlify sets x-nf-client-connection-ip). */
export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-nf-client-connection-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}
