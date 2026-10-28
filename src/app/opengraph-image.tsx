import { site } from "@/data/site";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = site.title;

export default async function Image() {
  return renderOg({ eyebrow: "Diadem in Sri Lanka", title: "Pressure makes diamonds.", subtitle: "Tennis · Pickleball · Strings · Court shoes" });
}
