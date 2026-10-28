import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { getAdminSession } from "@/lib/server/admin-auth";
import { hasAdmin } from "@/lib/server/env";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="font-display mt-8 text-5xl text-white">Admin</h1>
        {!hasAdmin() && (
          <p className="mt-4 bg-accent p-3 text-sm text-ink">
            Admin login isn&apos;t set up yet. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET to .env.local, then restart the server.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
