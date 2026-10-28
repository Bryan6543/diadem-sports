import Link from "next/link";
import { requireAdmin } from "@/lib/server/admin-auth";
import { ImportForm } from "./import-form";

export const metadata = { title: "Import products" };

export default async function ImportPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        ← All products
      </Link>
      <h1 className="font-display mt-2 text-4xl">Import products (CSV)</h1>
      <div className="mt-6 space-y-3 bg-white p-6 text-sm text-body">
        <p>You can upload either:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>A Shopify product export</strong> from unitedsports.lk (Shopify admin → Products → Export → CSV). Descriptions, specs,
            photos, prices and options are read automatically. Existing products are matched by their store handle.
          </li>
          <li>
            <strong>This site&apos;s own template</strong> — download it with{" "}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download from a route handler */}
            <a href="/admin/products/export" className="font-semibold text-brand-deep underline">
              Export CSV
            </a>
            , edit it in Excel or Google Sheets, and upload it again. Lists (photos, features, specs) are separated with <code>|</code>, and specs
            are written as <code>Label: Value</code>.
          </li>
        </ul>
      </div>
      <ImportForm />
    </div>
  );
}
