import { getAcademies, getSponsoredPlayers, getStockedCategories } from "@/lib/catalog";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  links: NavLink[];
}

/** Main navigation: one dropdown per stocked collection (by product type) + a single "Discover" menu. */
export function getNav(): { collections: NavGroup[]; discover: NavLink[] } {
  const collections = getStockedCategories().map((c) => ({
    label: c.shortName,
    href: `/category/${c.slug}`,
    links: [
      { label: `All ${c.name.toLowerCase()}`, href: `/category/${c.slug}` },
      ...c.types.map((t) => ({ label: t, href: `/category/${c.slug}?type=${encodeURIComponent(t)}` })),
    ],
  }));
  const discover: NavLink[] = [
    { label: "About Us", href: "/about", description: "United Sports and Diadem in Sri Lanka" },
    { label: "The Diadem Story", href: "/diadem", description: "From one string in 2015 to the pro tour" },
    { label: "Technologies", href: "/technologies", description: "Kraibon, FS3, eTPU and more, explained" },
    { label: "Athletes", href: "/athletes", description: "Team Diadem on the ATP, WTA and pickleball tours" },
    { label: "Sponsorship", href: "/sponsorship", description: "How we back Sri Lankan academies and juniors" },
    ...getAcademies().map((a) => ({ label: a.shortName, href: `/sponsorship/${a.slug}`, description: "Partner academy" })),
    ...getSponsoredPlayers().map((p) => ({ label: p.name, href: `/sponsorship/${p.slug}`, description: "Sponsored junior" })),
    { label: "Stories", href: "/news", description: "News, guides and launches" },
  ];
  return { collections, discover };
}
