import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { referralSource, site } from "@/data/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const lkr = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

export function formatPrice(value: number) {
  return `Rs. ${lkr.format(value)}`;
}

/**
 * United Sports products carry a store link. Products without one (Diadem's wider range) are
 * information pages: no price, no stock line and no Buy button — only the wishlist.
 */
export function isSoldLocally(p: { retailerUrl: string }) {
  return Boolean(p.retailerUrl);
}

export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Adds UTM parameters to every outbound retailer link so United Sports can attribute visits. */
export function withReferral(url: string, content: string, campaign = "buy-now") {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", referralSource);
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", campaign);
    u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}

export function retailerHome(content: string) {
  return withReferral(site.retailer.url, content, "shop-retailer");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function readingTime(words: string) {
  return Math.max(1, Math.round(words.split(/\s+/).filter(Boolean).length / 220));
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `tel:+94${digits.replace(/^0/, "")}`;
}
