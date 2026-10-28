"use client";

import { useActionState, useId } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribeAction, type FormState } from "@/app/actions";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  source,
  tone = "dark",
  withName = false,
  className,
  onSuccess,
}: {
  source: string;
  tone?: "dark" | "light";
  withName?: boolean;
  className?: string;
  onSuccess?: () => void;
}) {
  const id = useId();
  const [state, action, pending] = useActionState(async (prev: FormState | null, fd: FormData) => {
    const res = await subscribeAction(prev, fd);
    if (res.ok) onSuccess?.();
    return res;
  }, null);
  const light = tone === "light";

  if (state?.ok) {
    return (
      <p role="status" className={cn("flex items-start gap-2 text-sm", light ? "text-white" : "text-ink", className)}>
        <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", light ? "text-brand-bright" : "text-brand-deep")} />
        {state.message}
      </p>
    );
  }

  const field = cn(
    "h-12 w-full border bg-transparent px-4 text-sm focus:outline-none",
    light
      ? "border-white/30 text-white placeholder:text-white/45 focus:border-brand-bright"
      : "border-ink/25 text-ink placeholder:text-muted focus:border-brand-deep",
  );

  return (
    <form action={action} className={cn("space-y-2", className)} noValidate>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {withName && (
        <>
          <label htmlFor={`${id}-name`} className="sr-only">
            First name (optional)
          </label>
          <input id={`${id}-name`} name="name" autoComplete="given-name" placeholder="First name (optional)" className={field} />
        </>
      )}
      <div className="flex">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-describedby={state && !state.ok ? `${id}-msg` : undefined}
          aria-invalid={state && !state.ok ? true : undefined}
          className={cn(field, "border-r-0")}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "grid h-12 w-14 shrink-0 place-items-center transition-colors",
            light ? "bg-brand-bright text-ink hover:bg-white" : "bg-ink text-white hover:bg-brand-deep",
          )}
          aria-label="Subscribe"
        >
          {pending ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <ArrowRight aria-hidden className="size-5" />}
        </button>
      </div>
      {state && !state.ok && (
        <p id={`${id}-msg`} role="alert" className={cn("text-sm", light ? "text-accent" : "text-red-700")}>
          {state.message}
        </p>
      )}
    </form>
  );
}
