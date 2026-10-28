import type { ImageRef } from "@/lib/types";

/**
 * Home page hero slides, in order. Each image can be replaced in /admin → Site images
 * (slot "home.slide.<id>"). Facts come from diademsports.com and the United Sports listings.
 * When `productSlug` points at a product sold by United Sports, the slide shows its live price
 * and a "Buy on United Sports" button.
 */
export interface HeroSlide {
  id: string;
  /** Short label for the slide tabs. */
  label: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  text: string;
  image: ImageRef;
  /** CSS object-position for the photo (keep the subject clear of the text on the left). */
  position?: string;
  /** Giant outlined word behind the headline. */
  outline: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  productSlug?: string;
  /** Product line-up on a light studio backdrop: shade only the text side so the products stay bright. */
  lightBackdrop?: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "arriving-soon",
    label: "Arriving soon",
    eyebrow: "Just ordered from Diadem",
    title: "Arriving soon",
    subtitle: "Three Elevate rackets on their way",
    text: "The Elevate Lite 98 V3, the Elevate Lite 98 V3 in Limited Edition Teal and the new Elevate V4 Team 98 are coming to United Sports stores. Control rackets with Kraibon for a comfortable, arm-friendly feel.",
    image: {
      src: "/images/arriving/hero.jpg",
      alt: "Diadem Elevate Lite 98 V3 in blue, Elevate Lite 98 V3 Limited Edition Teal and Elevate V4 Team 98 tennis rackets",
    },
    position: "80% 50%",
    outline: "Elevate",
    cta: { label: "See the new arrivals", href: "/#arriving-soon" },
    secondary: { label: "Ask the store", href: "/contact" },
    lightBackdrop: true,
  },
  {
    id: "project-bublik",
    label: "Project Bublik",
    eyebrow: "Team Diadem · New for 2026",
    title: "Project Bublik",
    subtitle: "Built with Alexander Bublik",
    text: "The career-high world No. 10 is building his signature racket with Diadem's engineers — and every iteration goes on sale in the same form he tests.",
    image: { src: "/images/brand/bublik-backhand.jpg", alt: "Alexander Bublik hitting a backhand with his Project Bublik racket" },
    position: "62% 35%",
    outline: "Bublik",
    cta: { label: "Read the story", href: "/news/bublik-joins-team-diadem" },
    secondary: { label: "Meet Team Diadem", href: "/athletes" },
  },
  {
    id: "axis",
    label: "Axis 100 FS3",
    eyebrow: "Tennis rackets · In stock at United Sports",
    title: "Axis 100 FS3",
    subtitle: "Unrivalled spin",
    text: "An Air Foil Frame built for swing speed and spin, Precision + Strike Zone for a consistent strike, and Kraibon to take the sting out of every hit.",
    image: { src: "/images/brand/axis-at-net.jpg", alt: "A Diadem Axis racket resting on the net" },
    position: "70% 50%",
    outline: "Axis",
    cta: { label: "View the Axis", href: "/products/diadem-axis-100-fs3-tennis-racket" },
    productSlug: "diadem-axis-100-fs3-tennis-racket",
  },
  {
    id: "tennis-rackets",
    label: "Tennis rackets",
    eyebrow: "Tennis rackets",
    title: "Axis. Nova. Elevate.",
    subtitle: "Spin, power or control",
    text: "Three Diadem frame families, each tuned for a different game: Axis for spin, Nova for easy power, Elevate for control. All three are available in Sri Lanka from United Sports.",
    image: { src: "/images/brand/axis-on-court.jpg", alt: "A player sitting at the net with a Diadem racket and tennis balls" },
    position: "65% 40%",
    outline: "Tennis",
    cta: { label: "Shop tennis rackets", href: "/category/tennis-rackets" },
    secondary: { label: "Which racket is right for me?", href: "/news/axis-nova-elevate-which-racket" },
  },
  {
    id: "on-tour",
    label: "On tour",
    eyebrow: "Proven on tour",
    title: "Played by Svitolina",
    subtitle: "Career-high WTA No. 3",
    text: "Seventeen WTA titles and an Olympic bronze — now competing with the signature Axis 98 she helped design.",
    image: { src: "/images/brand/athlete-elina-svitolina.jpg", alt: "Elina Svitolina striking a forehand on clay" },
    position: "30% 30%",
    outline: "Tour",
    cta: { label: "Meet Team Diadem", href: "/athletes" },
    secondary: { label: "Shop tennis rackets", href: "/category/tennis-rackets" },
  },
  {
    id: "pickleball",
    label: "Pickleball",
    eyebrow: "Pickleball · USA Pickleball Quiet Approved",
    title: "Hush",
    subtitle: "About 40% quieter",
    text: "An eTPU foam face and two-piece moulding make the Hush lab-tested to be about 40% quieter than a standard paddle.",
    image: { src: "/images/brand/pickleball-court.jpg", alt: "Diadem pickleballs on a blue court" },
    position: "50% 60%",
    outline: "Pickleball",
    cta: { label: "View the Hush", href: "/products/diadem-hush-pickleball-paddle-racket" },
    secondary: { label: "Shop pickleball", href: "/category/pickleball" },
    productSlug: "diadem-hush-pickleball-paddle-racket",
  },
];
