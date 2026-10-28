import { NextResponse, type NextRequest } from "next/server";
import { setSubscriptionByToken } from "@/lib/server/newsletter";

/** RFC 8058 one-click unsubscribe (mail clients POST here from the List-Unsubscribe header). */
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const ok = await setSubscriptionByToken(token, false);
  return new NextResponse(ok ? "Unsubscribed" : "Invalid link", { status: ok ? 200 : 400 });
}

/** A plain visit shows the confirmation page instead of unsubscribing silently. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  return NextResponse.redirect(new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, req.url));
}
