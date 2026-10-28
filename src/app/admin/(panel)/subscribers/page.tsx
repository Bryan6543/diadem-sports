import { Download } from "lucide-react";
import { buttonClass } from "@/components/ui/primitives";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabase } from "@/lib/server/supabase";
import type { Subscriber } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Subscribers" };
export const dynamic = "force-dynamic";

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireAdmin();
  const { q = "", status = "" } = await searchParams;
  const db = getSupabase();
  let rows: Subscriber[] = [];
  let error = "";
  if (db) {
    let query = db.from("subscribers").select("id, email, name, source, status, created_at, updated_at").order("created_at", { ascending: false }).limit(1000);
    if (status === "active" || status === "unsubscribed") query = query.eq("status", status);
    if (q.trim()) query = query.ilike("email", `%${q.trim().replace(/[%_]/g, "")}%`);
    const res = await query;
    if (res.error) error = res.error.message;
    rows = (res.data ?? []) as Subscriber[];
  }
  const exportHref = `/admin/subscribers/export?${new URLSearchParams({ q, status }).toString()}`;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">Subscribers</h1>
          <p className="mt-1 text-sm text-muted">{db ? `${rows.length} shown` : "Connect the database to collect subscribers."}</p>
        </div>
        {db && (
          <a href={exportHref} className={buttonClass("outline", "py-2.5")}>
            <Download aria-hidden className="size-4" /> Export CSV
          </a>
        )}
      </div>
      <form className="mt-6 flex flex-wrap gap-2 bg-white p-3" role="search">
        <label htmlFor="q" className="sr-only">
          Search email
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Search email…" className="h-10 min-w-56 flex-1 border border-ink/20 px-3 text-sm" />
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className="h-10 border border-ink/20 px-2 text-sm">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <button type="submit" className={buttonClass("dark", "py-2")}>
          Filter
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-4 overflow-x-auto bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="p-3">Email</th>
              <th scope="col" className="p-3">Name</th>
              <th scope="col" className="p-3">Source</th>
              <th scope="col" className="p-3">Status</th>
              <th scope="col" className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((s) => (
              <tr key={s.id}>
                <td className="p-3 font-semibold">{s.email}</td>
                <td className="p-3">{s.name ?? "—"}</td>
                <td className="p-3 text-muted">{s.source}</td>
                <td className="p-3">{s.status === "active" ? "Active" : <span className="text-muted">Unsubscribed</span>}</td>
                <td className="p-3 text-muted">{formatDate(s.created_at)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
