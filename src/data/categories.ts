import type { Category } from "@/lib/types";

/** Collections shown on the site. Types follow the product `type` values from the store import. */
export const categories: Category[] = [
  {
    slug: "tennis-rackets",
    name: "Tennis Rackets",
    shortName: "Rackets",
    tagline: "Axis. Nova. Elevate.",
    description:
      "Three frame families for three ways to play: Axis for spin, Nova for easy power, Elevate for control. Built with Kraibon and Diadem's Flex Stabilization System — with new Elevate rackets arriving soon.",
    sport: "tennis",
    types: ["Axis", "Nova", "Elevate"],
    banner: { src: "/images/brand/axis-at-net.jpg", alt: "A Diadem Axis tennis racket resting on the net" },
    tile: { productSlug: "diadem-axis-100-fs3-tennis-racket", image: 6, fit: "cover", local: "/images/store/axis-100-fs3-net.jpg" },
  },
  {
    slug: "pickleball",
    name: "Pickleball",
    shortName: "Pickleball",
    tagline: "Paddles, kits and balls.",
    description:
      "From the USA Pickleball Quiet Approved Hush to the carbon-faced Icon and A52 — plus starter kits and tournament balls.",
    sport: "pickleball",
    types: ["Paddles", "Starter kits", "Pickleballs"],
    banner: { src: "/images/brand/pickleball-court.jpg", alt: "Diadem pickleballs on a blue court" },
    tile: { productSlug: "diadem-hush-pickleball-paddle-racket", image: 3, fit: "cover", local: "/images/store/hush-sky.jpg" },
  },
  {
    slug: "strings",
    name: "Strings",
    shortName: "Strings",
    tagline: "Where Diadem began.",
    description:
      "Diadem started in 2015 with a single tennis string. Today the Solstice family and Dark Matter come in sets and reels for every set-up.",
    sport: "tennis",
    types: ["String sets", "Reels"],
    banner: { src: "/images/brand/axis-detail.jpg", alt: "Close-up of a strung Diadem racket" },
    tile: {
      productSlug: "diadem-solstice-power-16l-reel-tennis-string",
      image: 5,
      fit: "cover",
      local: "/images/store/solstice-power-player.jpg",
    },
  },
  {
    slug: "shoes-apparel",
    name: "Shoes & Apparel",
    shortName: "Apparel",
    tagline: "Court Burst and kit.",
    description: "Court Burst shoes, performance socks, wristbands and Select headwear for long days on court.",
    sport: "all",
    types: ["Shoes", "Headwear", "Socks", "Wristbands"],
    banner: { src: "/images/brand/socks.jpg", alt: "Diadem performance socks in black and white" },
    tile: { productSlug: "diadem-snapback-select-hat", image: 6, fit: "contain" },
  },
  {
    slug: "accessories",
    name: "Accessories",
    shortName: "Accessories",
    tagline: "Balls and dampeners.",
    description:
      "Diadem tennis balls for every surface — regular duty, extra duty, all court and grass court — and the Diamond dampener.",
    sport: "tennis",
    types: ["Tennis balls", "Dampeners"],
    banner: { src: "/images/brand/tennis-balls-court.jpg", alt: "Diadem Premier tennis balls on court" },
    tile: { productSlug: "diadem-diamond-dampener", image: 0, fit: "contain" },
  },
  {
    slug: "bags",
    name: "Bags",
    shortName: "Bags",
    tagline: "Racket, paddle and travel bags.",
    description: "Diadem racket and paddle bags aren't stocked by United Sports yet. Sign up to hear when that changes.",
    sport: "all",
    comingSoon: true,
    types: ["Racket bags", "Duffels & backpacks", "Paddle bags", "Totes & drawstrings"],
    banner: { src: "/images/brand/bag-court.jpg", alt: "A Diadem paddle bag on court" },
  },
];
