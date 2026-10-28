import { NewsletterPopup } from "@/components/forms/newsletter-popup";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getNav } from "@/components/layout/nav-data";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/data/site";
import { retailerHome } from "@/lib/utils";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const nav = getNav();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] bg-brand-bright px-4 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <AnnouncementBar messages={site.announcements} />
      <Header
        collections={nav.collections}
        discover={nav.discover}
        shopHref={retailerHome("header")}
        retailerName={site.retailer.name}
      />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <NewsletterPopup />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.retailer.legalName,
          url: site.url,
          email: site.contactEmail,
          sameAs: site.socials.map((s) => s.href),
          address: {
            "@type": "PostalAddress",
            streetAddress: "No. 245, R. A. De Mel Mawatha",
            addressLocality: "Colombo 03",
            addressCountry: "LK",
          },
          telephone: "+94778437017",
        }}
      />
    </>
  );
}
