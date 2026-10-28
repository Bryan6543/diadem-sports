"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type ActionResult } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(loginAction, null);
  const field = "mt-2 h-12 w-full border border-white/25 bg-transparent px-4 text-white focus:border-brand-bright focus:outline-none";
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-white">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className={field} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-white">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={field} />
      </div>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 bg-brand-bright text-sm font-bold uppercase tracking-[0.12em] text-ink hover:bg-white disabled:opacity-60"
      >
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        Sign in
      </button>
    </form>
  );
}
