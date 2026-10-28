import "server-only";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getSiteImageOverride } from "./site-images";

export const ogSize = { width: 1200, height: 630 };

/** Fetches a remote PNG/JPEG as a data URI (Satori can't render WebP/SVG reliably). */
async function toDataUri(src: string | undefined) {
  if (!src || !/^https:\/\//.test(src) || !/\.(png|jpe?g)(\?|$)/i.test(src)) return null;
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/png";
    if (!/png|jpe?g/.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Shared social-share card. Uses the admin-uploaded logo when it's a PNG or JPEG. */
export async function renderOg({ eyebrow, title, subtitle, image }: { eyebrow: string; title: string; subtitle?: string; image?: string }) {
  const [logo, photo] = await Promise.all([getSiteImageOverride("logo").then((l) => toDataUri(l?.src)), toDataUri(image)]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0b0c", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: photo ? 700 : 1200 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only
            <img src={logo} alt="" height={44} style={{ objectFit: "contain", alignSelf: "flex-start" }} />
          ) : (
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: 4 }}>DIADEM</span>
              <span style={{ fontSize: 16, color: "#3fc3cb", letterSpacing: 4 }}>SRI LANKA</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 20, color: "#3fc3cb", letterSpacing: 4, textTransform: "uppercase" }}>{eyebrow}</span>
            <span style={{ fontSize: title.length > 40 ? 56 : 72, fontWeight: 800, lineHeight: 1, marginTop: 16, textTransform: "uppercase" }}>
              {title}
            </span>
            {subtitle && <span style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", marginTop: 20 }}>{subtitle}</span>}
          </div>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>
            {site.url.replace(/^https?:\/\//, "")} · Buy from {site.retailer.name}
          </span>
        </div>
        {photo && (
          <div style={{ display: "flex", width: 500, height: "100%", background: "#ffffff", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
            <img src={photo} alt="" width={440} height={550} style={{ objectFit: "contain" }} />
          </div>
        )}
      </div>
    ),
    ogSize,
  );
}
