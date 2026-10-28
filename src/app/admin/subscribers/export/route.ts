import { NextResponse, type NextRequest } from "next/server";
import { toCsv } from "@/lib/csv";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return new NextResponse("Unauthorised", { status: 401 });
  const db = getSupabase();
  if (!db) return new NextResponse("Database is not configured.", { status: 503 });
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const status = req.nextUrl.searchParams.get("status") ?? "";
  let query = db.from("subscribers").select("email, name, source, status, created_at").order("created_at", { ascending: false });
  if (status === "active" || status === "unsubscribed") query = query.eq("status", status);
  if (q) query = query.ilike("email", `%${q.replace(/[%_]/g, "")}%`);
  const { data, error } = await query;
  if (error) return new NextResponse(error.message, { status: 500 });
  const csv = toCsv(
    ["email", "name", "source", "status", "joined"],
    (data ?? []).map((s) => [s.email, s.name ?? "", s.source, s.status, s.created_at]),
  );
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
