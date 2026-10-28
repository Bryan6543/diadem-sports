import Image from "next/image";
import Link from "next/link";
import { Download, Plus, Upload } from "lucide-react";
import { buttonClass } from "@/components/ui/primitives";
import { seedProducts } from "@/data/products";
import { getCategories, getCategory } from "@/lib/catalog";
import { requireAdmin } from "@/lib/server/admin-auth";
import { dbListProducts } from "@/lib/server/products-db";
import { cn, formatPrice, isSoldLocally } from "@/lib/utils";
import { PublishToggle, RestoreSeedButton, SyncPhotosButton } from "./product-tools";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const { q = "", category = "", status = "", deleted } = await searchParams;
  let fromDb = true;
  let all = await dbListProducts().catch(() => null);
  if (!all) {
    fromDb = false;
    all = seedProducts;
  }
  const term = q.toLowerCase().trim();
  const list = all.filter(
    (p) =>
      (!term || `${p.name} ${p.slug} ${p.type}`.toLowerCase().includes(term)) &&
      (!category || p.category === category) &&
      (!status ||
        (status === "published" && p.published) ||
        (status === "hidden" && !p.published) ||
        (status === "soldout" && isSoldLocally(p) && !p.inStock) ||
        (status === "info" && !isSoldLocally(p)) ||
        (status === "nophoto" && !p.images.length)),
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {list.length} of {all.length} shown{!fromDb && " · bundled data (read-only until the database is connected)"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {fromDb && <SyncPhotosButton />}
          <Link href="/admin/products/import" className={buttonClass("outline", "py-2.5")}>
            <Upload aria-hidden className="size-4" /> Import CSV
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download from a route handler */}
          <a href="/admin/products/export" className={buttonClass("outline", "py-2.5")}>
            <Download aria-hidden className="size-4" /> Export CSV
          </a>
          {fromDb && (
            <Link href="/admin/products/new" className={buttonClass("dark", "py-2.5")}>
              <Plus aria-hidden className="size-4" /> New product
            </Link>
          )}
        </div>
      </div>

      {deleted && <p className="mt-4 bg-brand-wash p-3 text-sm">Product deleted.</p>}

      <form className="mt-6 flex flex-wrap gap-2 bg-white p-3" role="search">
        <label htmlFor="q" className="sr-only">
          Search products
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Search name or slug…" className="h-10 min-w-56 flex-1 border border-ink/20 px-3 text-sm" />
        <label htmlFor="category" className="sr-only">
          Collection
        </label>
        <select id="category" name="category" defaultValue={category} className="h-10 border border-ink/20 px-2 text-sm">
          <option value="">All collections</option>
          {getCategories().map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className="h-10 border border-ink/20 px-2 text-sm">
          <option value="">Any status</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
          <option value="soldout">Sold out</option>
          <option value="info">Information pages</option>
          <option value="nophoto">No photo</option>
        </select>
        <button type="submit" className={buttonClass("dark", "py-2")}>
          Filter
        </button>
      </form>

      <div className="mt-4 overflow-x-auto bg-white">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="p-3">
                Product
              </th>
              <th scope="col" className="p-3">
                Collection
              </th>
              <th scope="col" className="p-3">
                Price
              </th>
              <th scope="col" className="p-3">
                Stock
              </th>
              <th scope="col" className="p-3">
                Published
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((p) => (
              <tr key={p.id} className={cn(!p.published && "bg-mist/60 text-muted")}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden bg-mist">
                      {p.images[0] && <Image src={p.images[0].src} alt="" fill sizes="48px" className="object-cover" />}
                    </span>
                    <span>
                      {fromDb ? (
                        <Link href={`/admin/products/${encodeURIComponent(p.id)}`} className="font-semibold text-ink hover:text-brand-deep hover:underline">
                          {p.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-ink">{p.name}</span>
                      )}
                      <span className="block text-xs text-muted">
                        /{p.slug} · {p.images.length} photo{p.images.length === 1 ? "" : "s"}
                        {p.featured && " · ★ featured"}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  {getCategory(p.category)?.name} <span className="text-muted">· {p.type}</span>
                </td>
                <td className="p-3 font-mono">{isSoldLocally(p) ? formatPrice(p.price) : "—"}</td>
                <td className="p-3">
                  {!isSoldLocally(p) ? (
                    <span className="text-muted">Information page</span>
                  ) : p.inStock ? (
                    "In stock"
                  ) : (
                    <span className="text-red-700">Sold out</span>
                  )}
                </td>
                <td className="p-3">{fromDb ? <PublishToggle id={p.id} published={p.published} /> : p.published ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {fromDb && (
        <div className="mt-8">
          <RestoreSeedButton />
        </div>
      )}
    </>
  );
}
