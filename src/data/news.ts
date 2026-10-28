import type { Article } from "@/lib/types";

/**
 * Stories. Every fact is taken from diademsports.com or the United Sports product listings;
 * sources are listed on each article. Covers are Diadem or United Sports photos, replaceable in /admin.
 */
export const articles: Article[] = [
  {
    slug: "bublik-joins-team-diadem",
    title: "Alexander Bublik joins Team Diadem — and builds his own racket",
    excerpt:
      "The career-high world No. 10 signed with Diadem in April 2026. Instead of endorsing a finished frame, he is developing one with Diadem's engineers.",
    category: "Team Diadem",
    date: "2026-10-10",
    author: "United Sports",
    cover: { src: "/images/brand/bublik-court.jpg", alt: "Alexander Bublik on court holding a Diadem racket" },
    blocks: [
      {
        type: "paragraph",
        text: "Alexander Bublik, the Kazakh player with a career-high ATP ranking of No. 10, joined Team Diadem in April 2026. What makes the signing unusual is what comes with it: Bublik is not endorsing a finished racket. He is building one.",
      },
      { type: "heading", text: "Project Bublik" },
      {
        type: "paragraph",
        text: "Diadem calls the current version Project Bublik — a checkpoint in an ongoing development process between Bublik and its engineers. Every iteration goes on sale in the same form he tests, and he currently plays the Project Bublik 98.",
      },
      {
        type: "callout",
        title: "In Sri Lanka",
        text: "Project Bublik is not stocked by United Sports at the moment. The Axis 100 FS3 — Diadem's spin-focused frame family — is available now.",
      },
      { type: "heading", text: "A growing pro roster" },
      {
        type: "paragraph",
        text: "Bublik joins a Team Diadem roster that Diadem says spans nine players across the ATP, WTA and pro pickleball tours, including Elina Svitolina (career-high WTA No. 3) and Yuta Funemizu, Japan's No. 1 pro pickleball player.",
      },
      { type: "products", title: "Shop the Axis family", slugs: ["diadem-axis-100-fs3-tennis-racket"] },
    ],
    sources: ["https://diademsports.com/pages/team-diadem", "https://diademsports.com/pages/about-us"],
    verified: true,
  },
  {
    slug: "meet-the-hush",
    title: "Meet the Hush: the quiet pickleball paddle",
    excerpt:
      "USA Pickleball Quiet Approved and lab-tested to be about 40% quieter than standard paddles. Here's how Diadem made a paddle that keeps the peace.",
    category: "Pickleball",
    date: "2026-10-06",
    author: "United Sports",
    cover: { src: "/images/store/hush-sky.jpg", alt: "The Diadem Hush paddle held up against the sky" },
    blocks: [
      {
        type: "paragraph",
        text: "Pickleball's pop is part of the fun — until you're playing early in the morning or next to homes. Diadem's answer is the Hush, a paddle that is USA Pickleball Quiet Approved and lab-tested to be about 40% quieter than a standard paddle.",
      },
      { type: "heading", text: "How it's quieter" },
      {
        type: "list",
        items: [
          "An eTPU foam hitting face designed to reduce sound",
          "An advanced two-piece moulding system",
          "An 18 mm paddle with an 8 mm polypropylene honeycomb core",
          "An elongated 16.5-inch shape with a 5.6-inch handle — room for a two-handed backhand",
        ],
      },
      {
        type: "paragraph",
        text: "Those specs come straight from the United Sports listing, which also gives a weight of 8.15 oz, a 240 mm balance point and a 4 1/8-inch (G1) grip.",
      },
      { type: "products", title: "Shop the Hush", slugs: ["diadem-hush-pickleball-paddle-racket"] },
    ],
    sources: ["https://diademsports.com/products/hush", "https://www.unitedsports.lk/products/diadem-hush-pickleball-paddle-racket"],
    verified: true,
  },
  {
    slug: "axis-nova-elevate-which-racket",
    title: "Axis, Nova or Elevate? Choosing your Diadem racket",
    excerpt: "Spin, power or control — a plain-language guide to the three Diadem frame families available in Sri Lanka.",
    category: "Guides",
    date: "2026-09-30",
    author: "United Sports",
    cover: { src: "/images/brand/rackets-fence.jpg", alt: "A line-up of Diadem tennis rackets leaning against a court fence" },
    blocks: [
      {
        type: "paragraph",
        text: "Diadem builds three main tennis frame families. All three use Kraibon, the Flex Stabilization System and HMT Carbon — the difference is what each one is tuned for.",
      },
      { type: "heading", text: "Axis — for spin" },
      {
        type: "paragraph",
        text: "The Axis 100 FS3 has a 100 sq in head and a 16×19 pattern. Its Air Foil Frame Design is built for swing speed and spin, and Precision + Strike Zone moves the tightest part of the string bed up to where modern players make contact.",
      },
      { type: "heading", text: "Nova — for easy power" },
      {
        type: "paragraph",
        text: "The Nova 100 V3 also has a 100 sq in head and a 16×19 pattern, with an expansive sweet spot. Diadem's FS2 double-rib structure gives stability and power.",
      },
      { type: "heading", text: "Elevate — for control" },
      {
        type: "paragraph",
        text: "The Elevate Lite 98 V3 is the lightest Elevate, with a 98 sq in head and a denser 16×20 pattern. Diadem pitches it at aggressive, precise ball-strikers who like to create their own power.",
      },
      {
        type: "callout",
        title: "Get it strung right",
        text: "United Sports' founder is a U.S.R.S.A.-certified stringer. Ask in store about string and tension before you buy.",
      },
      {
        type: "products",
        title: "Compare the three",
        slugs: ["diadem-axis-100-fs3-tennis-racket", "diadem-nova-100-v3-tennis-racket", "diadem-elevate-lite-98-v3-tennis-racket"],
      },
    ],
    sources: [
      "https://diademsports.com/products/axis-100",
      "https://diademsports.com/products/nova-v3",
      "https://diademsports.com/products/diadem-elevate-lite-v3",
    ],
    verified: true,
  },
  {
    slug: "where-diadem-began-solstice",
    title: "Where Diadem began: one string, built for spin",
    excerpt: "Diadem started in a South Florida garage in 2015 with a single tennis string. Meet the Solstice family.",
    category: "Brand",
    date: "2026-09-22",
    author: "United Sports",
    cover: { src: "/images/store/solstice-power-closeup.jpg", alt: "Close-up of teal Solstice Power strings" },
    blocks: [
      {
        type: "paragraph",
        text: "Diadem Sports was founded in 2015 in South Florida with a single focus: set the standard for performance equipment in racket sports. It started in a garage with one tennis string and spent years working to get it right.",
      },
      {
        type: "quote",
        text: "That taught us how we'd build everything after it: deliberately, with every detail tested and refined.",
        cite: "Diadem Sports, About us",
      },
      { type: "heading", text: "Solstice Power" },
      {
        type: "paragraph",
        text: "Solstice Power is a comfortably soft co-poly with a six-pointed star shape — a low-friction surface with maximum ball bite. Diadem says it was built for spin.",
      },
      { type: "products", title: "Shop Solstice", slugs: ["diadem-solstice-power-16l-reel-tennis-string", "diadem-solstice-power-16l-tennis-string-set"] },
    ],
    sources: ["https://diademsports.com/pages/about-us", "https://diademsports.com/products/diadem-solstice-power"],
    verified: true,
  },
];
