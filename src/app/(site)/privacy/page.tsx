import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/legal-page";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Privacy notice", alternates: { canonical: "/privacy" } };

// NOTE FOR UNITED SPORTS: have this notice reviewed against Sri Lanka's Personal Data Protection Act before launch.
export default function PrivacyPage() {
  const r = site.retailer;
  return (
    <LegalPage title="Privacy notice" updated="13 October 2026" href="/privacy">
      <p>
        diademsports.lk is operated by {r.legalName} (&ldquo;we&rdquo;), {r.stores[0].address}. This notice explains what personal
        information this website collects and how we use it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Newsletter sign-ups:</strong> your email address, optional first name, and where you signed up.
        </li>
        <li>
          <strong>Contact form:</strong> your name, email, optional phone number and your message.
        </li>
        <li>
          <strong>Wishlist:</strong> saved products are stored only in your own browser (local storage). We never receive them.
        </li>
        <li>
          <strong>Technical data:</strong> your IP address is used briefly to prevent spam and abuse (rate limiting).
        </li>
      </ul>
      <h2>Purchases</h2>
      <p>
        This site has no cart or checkout. When you press &ldquo;Buy now&rdquo; you are taken to {r.host}, where your purchase is governed
        by that store&apos;s own policies. Links to {r.host} include referral tags so we can see which pages helped you.
      </p>
      <h2>How we use your information</h2>
      <ul>
        <li>To send the newsletter you asked for — you can unsubscribe with one click from any email.</li>
        <li>To reply to your enquiries.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h2>Service providers</h2>
      <p>
        We use Supabase (database hosting), Resend (email delivery) and Netlify (website hosting). They process data on our behalf and
        may store it outside Sri Lanka.
      </p>
      <h2>Children</h2>
      <p>
        Pages about sponsored junior players show sporting information only and are published with written parental consent. We never
        publish a junior&apos;s date of birth, school, address or contact details.
      </p>
      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete your information by emailing <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
