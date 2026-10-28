/**
 * Site-wide configuration.
 * Retailer details were taken from https://www.unitedsports.lk (footer, contact policy,
 * shipping policy and About page) on 13 October 2026.
 * Anything marked `verified: false` must be confirmed by United Sports before launch.
 */
export const site = {
  name: "Diadem Sri Lanka",
  brand: "Diadem",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://diademsports.lk").replace(/\/$/, ""),
  title: "Diadem Sri Lanka — Tennis & Pickleball Equipment",
  description:
    "Explore Diadem tennis rackets, pickleball paddles, strings, shoes and accessories in Sri Lanka. Browse the range, compare specs and buy from United Sports.",
  tagline: "Pressure makes diamonds.",
  disclaimer:
    "diademsports.lk is a product showcase operated by United Sports (Pvt) Ltd, a Sri Lankan retailer of Diadem products. It is not operated by Diadem Sports. Diadem and the Diadem logo are trademarks of their owner. All purchases are completed on unitedsports.lk.",

  retailer: {
    name: "United Sports",
    legalName: "United Sports (Pvt) Ltd",
    url: "https://www.unitedsports.lk",
    host: "unitedsports.lk",
    diademCollectionUrl: "https://www.unitedsports.lk/collections/vendors?q=DIADEM",
    email: "info@unitedsports.lk",
    since: "Over 35 years in racquet sports",
    about:
      "United Sports (Pvt) Ltd has served Sri Lankan racquet sports for more than three decades — from national athletes and school teams to first-time players. Founder Mr. Thilak Meddegoda is a U.S.R.S.A.-certified stringer and racquet technician.",
    stores: [
      {
        name: "United Sports — Colombo 03",
        address: "No. 245, R. A. De Mel Mawatha, Colombo 03, Sri Lanka",
        phones: ["011 257 4797", "077 843 7017"],
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=United+Sports+245+R.+A.+De+Mel+Mawatha+Colombo+03",
        hours: "Opening hours — please call to confirm",
        hoursVerified: false,
      },
      {
        name: "United Sports — SLTA, Colombo 07",
        address: "Sri Lanka Tennis Association, No. 45, Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka",
        phones: ["011 266 6778", "075 178 0154"],
        mapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Sri+Lanka+Tennis+Association+45+Sir+Marcus+Fernando+Mawatha+Colombo+07",
        hours: "Opening hours — please call to confirm",
        hoursVerified: false,
      },
    ],
  },

  contactEmail: "unitedsports@sltnet.lk",

  socials: [
    { label: "Facebook", href: "https://www.facebook.com/UnitedSportsSL/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/unitedsports.lk/", icon: "instagram" },
    { label: "TikTok", href: "https://www.tiktok.com/@united.sports6", icon: "tiktok" },
  ],

  diademOfficial: {
    url: "https://diademsports.com",
    instagram: "https://www.instagram.com/diademsports/",
  },

  /** Rotating announcement bar. Keep every message true. */
  announcements: ["Island-wide delivery across Sri Lanka — order Diadem online from United Sports"],

  marquee: ["Pressure makes diamonds", "Tennis", "Pickleball", "Strings", "Court shoes", "Designed by players", "Proven under pressure"],

  /** Diadem's three core values (diademsports.com/pages/about-us). */
  pillars: [
    { title: "Crafted with intent", text: "Every weight, material and construction method is chosen for a reason." },
    { title: "Designed by players", text: "Built in-house by former collegiate and professional players and coaches." },
    { title: "Proven under pressure", text: "Tested in the lab and on court, from club players to the pro tour." },
  ],
} as const;

export const referralSource = "diadem-showcase";
