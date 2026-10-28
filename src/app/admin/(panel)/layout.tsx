import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { requireAdmin } from "@/lib/server/admin-auth";
import { hasResend, hasSupabase } from "@/lib/server/env";
import { logoutAction } from "../actions";
import { AdminNav } from "./admin-nav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <>
      <header className="sticky top-0 z-40 bg-ink text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
          <Link href="/admin" aria-label="Admin home">
            <Logo />
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="hidden items-center gap-1 text-white/70 hover:text-white sm:flex">
              View site <ExternalLink aria-hidden className="size-3.5" />
            </Link>
            <span className="hidden text-white/50 md:inline">{session.email}</span>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-1 text-white/70 hover:text-white">
                <LogOut aria-hidden className="size-4" /> Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      {(!hasSupabase() || !hasResend()) && (
        <div className="bg-accent text-ink">
          <p className="mx-auto max-w-7xl px-4 py-2 text-sm">
            {!hasSupabase() && "Database (Supabase) isn't connected — the site is showing bundled data and saving is disabled. "}
            {!hasResend() && "Email (Resend) isn't connected — newsletter and contact emails won't send. "}
            See README → Setup.
          </p>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </>
  );
}
