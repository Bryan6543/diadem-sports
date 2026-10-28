export type Sport = "tennis" | "pickleball" | "all";

export type CategorySlug = "tennis-rackets" | "pickleball" | "strings" | "shoes-apparel" | "accessories" | "bags";

export interface ImageRef {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Spec {
  label: string;
  value: string;
}

export interface ProductVariant {
  name: string;
  available: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  type: string;
  sport: Sport;
  shortDescription: string;
  description: string[];
  features: string[];
  specs: Spec[];
  included: string[];
  idealFor: string[];
  technologies: string[];
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  variants: ProductVariant[];
  images: ImageRef[];
  retailerHandle: string;
  retailerUrl: string;
  featured: boolean;
  featuredRank: number | null;
  spotlight: boolean;
  published: boolean;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  sport: Sport;
  /** Product types shown in the nav dropdown, in order. */
  types: string[];
  /** Not stocked yet in Sri Lanka: the page shows an empty state + newsletter. */
  comingSoon?: boolean;
  /** Full-width collection banner photo (admin-replaceable). */
  banner: ImageRef;
  /**
   * Preferred unitedsports.lk product photo for the home category tile. Used only while that
   * product is sold locally and in stock; otherwise another in-stock product is picked.
   */
  tile?: CategoryTile;
}

export interface CategoryTile {
  productSlug: string;
  /** Index into the product's images. */
  image: number;
  /** "cover" for lifestyle photos, "contain" for product shots on white. */
  fit: "cover" | "contain";
  /** Trimmed local copy of the same store photo (scripts/store-images.mjs), without the white frame. */
  local?: string;
}

export interface Technology {
  slug: string;
  name: string;
  short: string;
  description: string;
  appliesTo: string;
  source: string;
  verified: boolean;
  image: ImageRef;
}

export interface Athlete {
  slug: string;
  name: string;
  country: string;
  sport: Exclude<Sport, "all">;
  tour: string;
  highlight: string;
  bio: string;
  plays: string;
  quote?: { text: string; context: string };
  source: string;
  verified: boolean;
  isSample?: boolean;
  /** Portrait photo; `position` is the CSS object-position for 4:5 crops. */
  photo: ImageRef & { position?: string };
}

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite: string }
  | { type: "callout"; title: string; text: string }
  | { type: "products"; slugs: string[]; title?: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  cover: ImageRef;
  blocks: ArticleBlock[];
  sources: string[];
  verified: boolean;
}

export interface TimelineItem {
  label: string;
  title: string;
  text: string;
}

export interface Academy {
  kind: "academy";
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  isSample: boolean;
  location: string;
  address: string;
  mapsUrl: string;
  phones: string[];
  socials: { label: string; href: string }[];
  facts: { label: string; value: string }[];
  story: string[];
  founder: { name: string; role: string; bio: string };
  mission: string;
  pillars: { title: string; text: string }[];
  facilities: string[];
  before: ImageRef[];
  after: ImageRef[];
  timeline: TimelineItem[];
  logo?: ImageRef;
  hero: ImageRef;
}

export interface SponsoredPlayer {
  kind: "player";
  slug: string;
  name: string;
  isSample: boolean;
  ageGroup: string;
  sport: Exclude<Sport, "all">;
  academySlug?: string;
  coach: string;
  ranking: { value: string; label: string };
  tagline: string;
  bio: string[];
  milestoneQuote?: { text: string; cite: string };
  kit: { label: string; productSlug?: string }[];
  results: { year: string; items: { title: string; isTitle?: boolean }[] }[];
  portrait: ImageRef;
}

export type Sponsorship = Academy | SponsoredPlayer;

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: "active" | "unsubscribed";
  created_at: string;
  updated_at: string;
}
