import type { Technology } from "@/lib/types";

/**
 * Diadem technologies, described only as Diadem describes them on diademsports.com
 * (product pages for Axis 100, Nova V3 100, Elevate V3 Lite 98, Hush, Icon, Solstice Power,
 * Court Burst, DryCore Select Visor, and the About page). Checked 13 October 2026.
 */
export const technologies: Technology[] = [
  {
    slug: "kraibon",
    name: "Kraibon",
    short: "Motorsport-grade elastomer that dampens harmful vibration.",
    description:
      "Kraibon is an elastomer widely used in motorsports and aerospace engineering. Built into the frame, it dampens harmful vibrations for comfort, and on the Elevate it increases both flexibility and stability without sacrificing power.",
    appliesTo: "Axis, Nova V3 and Elevate V3 tennis rackets",
    source: "https://diademsports.com/products/axis-100",
    verified: true,
    image: { src: "/images/brand/axis-towel.jpg", alt: "A Diadem Axis racket resting on a towel" },
  },
  {
    slug: "fs-system",
    name: "Flex Stabilization System",
    short: "Carbon ribs, HMT Carbon and high-density foam placed where the frame needs them.",
    description:
      "Diadem's Flex Stabilization System (FS) combines carbon-fibre ribs with HMT Carbon and high-density foam in targeted areas of the frame. FS2 on the Nova V3 uses a double-rib structure; FS3 on the Axis uses three ribs — for stability, power and a responsive feel.",
    appliesTo: "Axis (FS3), Nova V3 (FS2) and Elevate rackets",
    source: "https://diademsports.com/products/nova-v3",
    verified: true,
    image: { src: "/images/brand/nova-on-court.jpg", alt: "A Diadem Nova racket on court" },
  },
  {
    slug: "hmt-carbon",
    name: "HMT Carbon",
    short: "The carbon layup at the heart of Diadem's racket frames.",
    description:
      "HMT Carbon is used together with the Flex Stabilization System and high-density foam across Diadem's racket line. United Sports lists HMT Carbon graphite as the frame material for the Axis, Nova and Elevate models it stocks.",
    appliesTo: "Axis, Nova and Elevate tennis rackets",
    source: "https://diademsports.com/products/axis-100",
    verified: true,
    image: { src: "/images/brand/axis-serve.jpg", alt: "A player holding a Diadem Axis racket and a ball" },
  },
  {
    slug: "air-foil-frame",
    name: "Air Foil Frame Design",
    short: "A frame profile built to maximise swing speed and spin.",
    description:
      "The Axis series uses Diadem's Air Foil Frame Design to maximise swing speed and spin generation — the reason Diadem calls the Axis its spin racket.",
    appliesTo: "Axis tennis rackets",
    source: "https://diademsports.com/products/axis-100",
    verified: true,
    image: { src: "/images/brand/axis-at-net.jpg", alt: "A Diadem Axis racket resting on the net" },
  },
  {
    slug: "precision-strike-zone",
    name: "Precision + Strike Zone",
    short: "Moves the tightest part of the string bed up to where modern players hit.",
    description:
      "Precision + Strike Zone shifts the tightest part of the string bed higher in the frame to align with the modern player's strike zone, for enhanced feel and greater consistency on contact.",
    appliesTo: "Axis tennis rackets",
    source: "https://diademsports.com/products/axis-100",
    verified: true,
    image: { src: "/images/brand/axis-detail.jpg", alt: "Close-up of the Axis string bed" },
  },
  {
    slug: "etpu-quiet-face",
    name: "eTPU Quiet Face",
    short: "A foam face and two-piece moulding for a paddle that's about 40% quieter.",
    description:
      "The Hush pairs an eTPU foam face with an advanced two-piece moulding system. It is USA Pickleball Quiet Approved and lab-tested by Diadem to be 40% quieter than standard paddles.",
    appliesTo: "Hush pickleball paddle",
    source: "https://diademsports.com/products/hush",
    verified: true,
    image: { src: "/images/store/hush-sky.jpg", alt: "The Diadem Hush paddle held up against the sky" },
  },
  {
    slug: "japanese-carbon",
    name: "Japanese Carbon Fibre Face",
    short: "A carbon face for a soft yet powerful feel.",
    description:
      "Diadem crafts the Icon paddle with Japanese carbon fibre for a soft yet powerful feel. United Sports lists a Japanese carbon fibre face on the Icon Classic it stocks.",
    appliesTo: "Icon pickleball paddles",
    source: "https://diademsports.com/products/diadem-icon-paddle",
    verified: true,
    image: { src: "https://cdn.shopify.com/s/files/1/0732/7583/4503/files/4_b56e6415-be24-4450-b5c5-565fd1f79e0f.png?v=1782990276", alt: "The Diadem Icon Classic pickleball paddle" },
  },
  {
    slug: "star-profile",
    name: "Six-Point Star Profile",
    short: "A star-shaped co-poly built for ball bite and spin.",
    description:
      "Solstice Power is a comfortably soft co-poly with a six-pointed star shape, combining a low-friction surface with maximum ball bite — a string built for spin.",
    appliesTo: "Solstice Power strings",
    source: "https://diademsports.com/products/diadem-solstice-power",
    verified: true,
    image: { src: "/images/store/solstice-power-closeup.jpg", alt: "Close-up of teal Solstice Power strings" },
  },
  {
    slug: "rebound-x",
    name: "Rebound X & Pro Stance X",
    short: "Lateral support and stability for sharp cuts and split steps.",
    description:
      "Underfoot, the Court Burst uses Diadem's Rebound X and Pro Stance X technologies for lateral support and stability through quick cuts, hard stops and fast recovery, with a cushioned EVA midsole and heel.",
    appliesTo: "Court Burst shoes",
    source: "https://diademsports.com/products/court-burst",
    verified: true,
    image: { src: "https://cdn.shopify.com/s/files/1/0732/7583/4503/files/9_d81e6c64-b15d-487a-899b-2e254c200e95.png?v=1782987820", alt: "The Diadem Court Burst shoe" },
  },
  {
    slug: "max-shield",
    name: "Max Shield Toe Guard",
    short: "Targeted toe protection without the extra weight.",
    description:
      "A precision-designed toe guard on the Court Burst that protects against toe drags and lunges without adding extra weight, paired with a form-fitting 360° stretch-knit upper.",
    appliesTo: "Court Burst shoes",
    source: "https://diademsports.com/products/court-burst",
    verified: true,
    image: { src: "https://cdn.shopify.com/s/files/1/0732/7583/4503/files/4_296640dc-0dfa-40e3-831e-87e5bade2a92.png?v=1782987820", alt: "Close-up of the Court Burst toe area" },
  },
  {
    slug: "drycore",
    name: "DryCore",
    short: "Moisture-wicking fabric for headwear and kit.",
    description:
      "DryCore is Diadem's wick-away, moisture-resistant technology, used in lightweight 100% polyester headwear such as the ITF-approved Select Visor.",
    appliesTo: "Select Hat and Select Visor",
    source: "https://diademsports.com/products/drycore-select-visor",
    verified: true,
    image: { src: "https://cdn.shopify.com/s/files/1/0732/7583/4503/files/4_a4ad59e7-5278-463b-bd66-f938bf532bd9.png?v=1790677644", alt: "The Diadem Select visor" },
  },
  {
    slug: "starcore",
    name: "StarCore",
    short: "Diadem's patented construction breakthrough.",
    description:
      "Diadem names its patented StarCore construction as one of its breakthroughs. The Solstice Power string packaging sold by United Sports carries the Star Core Technology mark.",
    appliesTo: "Solstice Power strings",
    source: "https://diademsports.com/pages/about-us",
    verified: true,
    image: { src: "https://cdn.shopify.com/s/files/1/0732/7583/4503/files/4_e4825a37-5931-4500-b0cb-09bfd65097a7.png?v=1783051953", alt: "Solstice Power string packaging showing the Star Core Technology mark" },
  },
];
