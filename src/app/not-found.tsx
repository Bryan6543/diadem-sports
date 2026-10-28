import SiteLayout from "./(site)/layout";
import NotFoundContent from "./(site)/not-found";

/** Unmatched URLs anywhere on the site get the normal header and footer. */
export default function RootNotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  );
}
