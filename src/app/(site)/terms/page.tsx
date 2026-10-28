import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Terms of use", alternates: { canonical: "/terms" } };

// NOTE FOR UNITED SPORTS: have these terms reviewed by your legal adviser before launch.
export default function TermsPage() {
  const r = site.retailer;
  return (
    <LegalPage title="Terms of use" updated="13 October 2026" href="/terms">
      <p>By using diademsports.lk you agree to these terms.</p>
      <h2>About this site</h2>
      <p>{site.disclaimer}</p>
      <h2>Products, prices and stock</h2>
      <p>
        Product information, prices and availability shown here come from {r.host} and may change. The price and stock shown on {r.host}{" "}
        at checkout always apply. Specifications are provided by {r.name} and the manufacturer; please ask in store if anything is unclear.
      </p>
      <h2>Purchases</h2>
      <p>
        All orders, payments, deliveries, returns and warranty claims are handled by {r.legalName} on {r.host}, under that store&apos;s
        terms and policies.
      </p>
      <h2>Content</h2>
      <p>
        Text and images on this site belong to their respective owners. Team Diadem athlete information is reproduced from Diadem&apos;s
        published materials. Some pages contain clearly labelled sample content that will be replaced.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
