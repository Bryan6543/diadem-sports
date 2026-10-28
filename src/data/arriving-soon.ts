import type { ImageRef, Spec } from "@/lib/types";

/**
 * Rackets from United Sports' latest Diadem order (invoice lines below), shown as "Arriving soon"
 * in the first hero slide, the home page section and as a badge on each product.
 * Details and photos: diademsports.com. Photos are built with `node scripts/arriving-images.mjs`.
 * When the shipment is on the shelves, remove the entries here (and list the new rackets on
 * unitedsports.lk so the site can link to them).
 */
export interface ArrivingRacket {
  /** Product page on this site. */
  productSlug: string;
  /** Line on the Diadem invoice ("#2" = grip size 2). */
  invoiceLine: string;
  name: string;
  series: string;
  colour: string;
  grip: string;
  summary: string;
  image: ImageRef;
  specs: Spec[];
  source: string;
}

/** Diadem lists the same frame numbers for the Elevate V3 Lite 98 and V4 Team 98. */
const ELEVATE_SPECS: Spec[] = [
  { label: "Head size", value: "98 sq in" },
  { label: "Weight", value: "290 g / 10.2 oz" },
  { label: "Balance", value: "3 pts HL / 335 mm" },
  { label: "Stiffness", value: "64 RA" },
  { label: "String pattern", value: "16 x 20" },
  { label: "Beam", value: "21.5 mm flat" },
];

export const arrivingSoon: ArrivingRacket[] = [
  {
    productSlug: "diadem-elevate-lite-98-v3-tennis-racket",
    invoiceLine: "Tennis Racquet - Elevate Lite 98 v3 #2",
    name: "Elevate Lite 98 V3",
    series: "Elevate V3",
    colour: "Metallic blue, satin finish",
    grip: "4 1/4 (L2)",
    summary: "The lightest option in Diadem's most manoeuvrable, user-friendly control series, with Kraibon for a more arm-friendly feel.",
    image: { src: "/images/arriving/elevate-lite-98-v3.jpg", alt: "Diadem Elevate Lite 98 V3 tennis racket in metallic blue" },
    specs: ELEVATE_SPECS,
    source: "https://diademsports.com/products/diadem-elevate-lite-v3",
  },
  {
    productSlug: "diadem-elevate-lite-98-v3-limited-edition-teal",
    invoiceLine: "Tennis Racquet - Elevate Lite 98 v3 #2 Ltd Edition Teal",
    name: "Elevate Lite 98 V3 Limited Edition Teal",
    series: "Elevate V3",
    colour: "Limited Edition Teal",
    grip: "4 1/4 (L2)",
    summary: "The same light, manoeuvrable Elevate Lite 98 V3 frame in Diadem's Limited Edition Teal colourway.",
    image: { src: "/images/arriving/elevate-lite-98-v3-teal.jpg", alt: "Diadem Elevate Lite 98 V3 Limited Edition Teal tennis racket" },
    specs: ELEVATE_SPECS,
    source: "https://diademsports.com/products/diadem-elevate-lite-v3",
  },
  {
    productSlug: "diadem-elevate-v4-team-98",
    invoiceLine: "Tennis Racquet - Elevate Team 98 v4 #2",
    name: "Elevate V4 Team 98",
    series: "Elevate V4",
    colour: "Metallic green, gloss finish",
    grip: "4 1/4 (L2)",
    summary: "The new generation of Elevate: Kraibon adds flexibility and stability without sacrificing power, on the FS system, high-density foam and HMT carbon.",
    image: { src: "/images/arriving/elevate-v4-team-98.jpg", alt: "Diadem Elevate V4 Team 98 tennis racket in metallic green" },
    specs: ELEVATE_SPECS,
    source: "https://diademsports.com/products/elevate-v4-team-98",
  },
];

export const arrivingSlugs = new Set(arrivingSoon.map((r) => r.productSlug));
