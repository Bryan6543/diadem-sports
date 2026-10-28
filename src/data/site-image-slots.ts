import { athletes } from "./athletes";
import { categories } from "./categories";
import { heroSlides } from "./hero-slides";
import { articles } from "./news";

export type SlotGroup = "brand" | "home" | "categories" | "collections" | "pages" | "athletes" | "stories";

export interface SiteImageSlot {
  key: string;
  group: SlotGroup;
  label: string;
  hint: string;
  /** Bundled default; null means "nothing shown until uploaded". */
  defaultSrc: string | null;
  defaultAlt: string;
}

export const slotGroups: { id: SlotGroup; label: string }[] = [
  { id: "brand", label: "Logos" },
  { id: "home", label: "Home slider" },
  { id: "categories", label: "Category tiles" },
  { id: "collections", label: "Collection banners" },
  { id: "pages", label: "About page" },
  { id: "athletes", label: "Athletes" },
  { id: "stories", label: "Stories" },
];

export const siteImageSlots: SiteImageSlot[] = [
  {
    key: "logo",
    group: "brand",
    label: "Site logo",
    hint: "Transparent PNG, at least 400 px wide. Shown on dark and light backgrounds.",
    defaultSrc: null,
    defaultAlt: "Diadem Sri Lanka",
  },
  {
    key: "retailer.logo",
    group: "brand",
    label: "United Sports logo",
    hint: "Transparent PNG, at least 400 px wide. Shown in the black box of the home page \"Buy from United Sports\" section.",
    defaultSrc: null,
    defaultAlt: "United Sports",
  },
  ...heroSlides.map((h, i) => ({
    key: `home.slide.${h.id}`,
    group: "home" as const,
    label: `Slide ${i + 1}: ${h.label}`,
    hint: "Landscape photo, 2400 × 1350 px or larger. Keep the subject on the right — text sits on the left.",
    defaultSrc: h.image.src,
    defaultAlt: h.image.alt,
  })),
  ...categories.map((c) => ({
    key: `category.${c.slug}`,
    group: "categories" as const,
    label: `${c.name} tile`,
    hint: "Optional. By default the tile shows a photo of an in-stock product from unitedsports.lk. An upload fills the whole tile (1600 × 1200 px).",
    defaultSrc: null,
    defaultAlt: c.name,
  })),
  {
    key: "collection.all",
    group: "collections",
    label: "All products banner",
    hint: "Wide banner, 2400 × 900 px. Text sits on the left.",
    defaultSrc: "/images/brand/axis-on-court.jpg",
    defaultAlt: "A player sitting at the net with a Diadem racket and tennis balls",
  },
  ...categories.map((c) => ({
    key: `collection.${c.slug}`,
    group: "collections" as const,
    label: `${c.name} banner`,
    hint: "Wide banner, 2400 × 900 px. Text sits on the left.",
    defaultSrc: c.banner.src,
    defaultAlt: c.banner.alt,
  })),
  {
    key: "about.hero",
    group: "pages",
    label: "About page header",
    hint: "Landscape photo of the store or team, 2400 × 1200 px.",
    defaultSrc: "/images/brand/rackets-fence.jpg",
    defaultAlt: "A line-up of Diadem tennis rackets against a court fence",
  },
  ...athletes.map((a) => ({
    key: `athlete.${a.slug}`,
    group: "athletes" as const,
    label: a.name,
    hint: "Portrait, 1200 × 1500 px (4:5). Only use photos you have the rights to.",
    defaultSrc: a.photo.src,
    defaultAlt: a.photo.alt,
  })),
  ...articles.map((a) => ({
    key: `story.${a.slug}`,
    group: "stories" as const,
    label: a.title,
    hint: "Cover photo, 1600 × 1000 px.",
    defaultSrc: a.cover.src,
    defaultAlt: a.cover.alt,
  })),
];

/** Logo slots keep PNG transparency and are previewed on a dark background. */
export const logoSlotKeys = new Set(["logo", "retailer.logo"]);

export const slotByKey = new Map(siteImageSlots.map((s) => [s.key, s]));
