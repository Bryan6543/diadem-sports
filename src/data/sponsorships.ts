import type { Academy, SponsoredPlayer, Sponsorship } from "@/lib/types";

/**
 * SAMPLE DATA — every entry here is a placeholder (isSample: true) until United Sports
 * sends real academy and player material. Pages show a visible "Sample content" ribbon.
 *
 * Junior players: publish sporting information only (name, age group, academy, coach,
 * results, kit). Never add date of birth, school, address, phone, email or ID numbers.
 * Written parental consent is required before a real junior is published.
 */

export const sampleAcademy: Academy = {
  kind: "academy",
  slug: "sample-tennis-academy",
  name: "Sample Tennis Academy",
  shortName: "Sample Academy",
  tagline: "A placeholder partner academy — replace with your real partner.",
  isSample: true,
  location: "Colombo, Sri Lanka",
  address: "Address to be confirmed",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Colombo+Sri+Lanka",
  phones: [],
  socials: [],
  facts: [
    { label: "Founded", value: "Year TBC" },
    { label: "Courts", value: "TBC" },
    { label: "Players coached", value: "TBC" },
    { label: "Partner since", value: "TBC" },
  ],
  story: [
    "This is sample text for a partner academy page. When United Sports sends the academy's story, founder profile and photos, this section will tell how the academy started, who it serves and what makes it special.",
    "Every fact on the real page will come from material the academy supplies or that can be verified publicly.",
  ],
  founder: {
    name: "Founder name",
    role: "Founder & head coach (sample)",
    bio: "A short profile of the academy's founder will go here — coaching background, qualifications and what drives them.",
  },
  mission: "Sample mission statement: making quality coaching and equipment accessible to every young player.",
  pillars: [
    { title: "Coaching", text: "Structured programmes for juniors and adults (sample)." },
    { title: "Equipment", text: "Diadem rackets and strings supplied through United Sports (sample)." },
    { title: "Community", text: "Open days, school clinics and tournaments (sample)." },
  ],
  facilities: ["Courts (number TBC)", "Floodlights (TBC)", "Stringing service via United Sports", "Changing rooms (TBC)"],
  before: [
    { src: "/images/brand/indoor-courts.jpg", alt: "Sample photo — replace with the academy's real 'before' photo" },
    { src: "/images/brand/coach-lesson.jpg", alt: "Sample photo — replace with the academy's real 'before' photo" },
  ],
  after: [
    { src: "/images/brand/players-on-court.jpg", alt: "Sample photo — replace with the academy's real 'after' photo" },
    { src: "/images/brand/club-players.jpg", alt: "Sample photo — replace with the academy's real 'after' photo" },
  ],
  timeline: [
    { label: "01", title: "First conversation", text: "How the partnership started (sample)." },
    { label: "02", title: "Plan agreed", text: "What United Sports and Diadem committed to (sample)." },
    { label: "03", title: "Work on court", text: "Resurfacing, kit and equipment delivered (sample)." },
    { label: "04", title: "Launch day", text: "The academy's relaunch with players and families (sample)." },
  ],
  hero: { src: "/images/brand/players-on-court.jpg", alt: "Players on court (sample photo)" },
};

export const samplePlayer: SponsoredPlayer = {
  kind: "player",
  slug: "sample-junior-player",
  name: "Sample Junior",
  isSample: true,
  ageGroup: "Under-14",
  sport: "tennis",
  academySlug: "sample-tennis-academy",
  coach: "Coach name (sample)",
  ranking: { value: "1", label: "Sample national ranking" },
  tagline: "A placeholder sponsored-junior page — replace with your real player.",
  bio: [
    "This is sample text for a sponsored junior. The real page will cover the player's sporting journey only: age group, academy, coach, results and the Diadem kit they use.",
    "Personal details such as date of birth, school, address and contact details are never published.",
  ],
  milestoneQuote: { text: "A quote from the player or coach about a milestone will appear here.", cite: "Name, role (sample)" },
  kit: [
    { label: "Racket", productSlug: "diadem-axis-100-fs3-tennis-racket" },
    { label: "String", productSlug: "diadem-solstice-power-16l-reel-tennis-string" },
    { label: "Dampener", productSlug: "diadem-diamond-dampener" },
    { label: "Headwear", productSlug: "diadem-polyester-select-visor-hat" },
    { label: "Socks", productSlug: "diadem-performance-crew-socks" },
  ],
  results: [
    {
      year: "Year TBC",
      items: [{ title: "Sample tournament — Winner", isTitle: true }, { title: "Sample tournament — Semi-finalist" }],
    },
    { year: "Year TBC", items: [{ title: "Sample tournament — Finalist" }] },
  ],
  portrait: { src: "/images/brand/bublik-racket-wall.jpg", alt: "A Diadem racket (sample photo — replace with the player's portrait)" },
};

export const sponsorships: Sponsorship[] = [sampleAcademy, samplePlayer];

export const sponsorshipProgramme = {
  intro:
    "United Sports backs Sri Lankan racquet sport at every level — from grassroots players to national athletes. Through Diadem, we support academies and juniors with equipment, stringing and on-court investment.",
  stats: [
    { value: "35+", label: "Years United Sports has served Sri Lankan racquet sport" },
    { value: "TBC", label: "Academies supported (sample)" },
    { value: "TBC", label: "Juniors sponsored (sample)" },
  ],
  areas: [
    { title: "Academies", text: "Equipment, stringing and facility support for partner academies." },
    { title: "Juniors", text: "Kit sponsorship for promising junior players, with parental consent." },
    { title: "Grassroots", text: "School clinics and community days to grow tennis and pickleball." },
  ],
};
