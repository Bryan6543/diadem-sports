"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { contactAction, type FormState } from "@/app/actions";
import { buttonClass } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const TOPICS = [
  { value: "product", label: "A product question" },
  { value: "stringing", label: "Stringing & servicing" },
  { value: "sponsorship", label: "Sponsorship & academies" },
  { value: "other", label: "Something else" },
];

export function ContactForm({ defaultTopic = "product" }: { defaultTopic?: string }) {
  const [state, action, pending] = useActionState<FormState | null, FormData>(contactAction, null);
  if (state?.ok) {
    return (
      <div role="status" className="flex gap-3 bg-brand-wash p-6 text-ink">
        <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-deep" />
        <p>{state.message}</p>
      </div>
    );
  }
  const err = (k: string) => state?.fieldErrors?.[k];
  const field = (k: string) =>
    cn("mt-2 w-full border bg-white px-4 py-3 focus:border-brand-deep focus:outline-none", err(k) ? "border-red-600" : "border-ink/20");

  return (
    <form action={action} className="space-y-5" noValidate>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="text-sm font-semibold">
            Name
          </label>
          <input id="c-name" name="name" required autoComplete="name" className={field("name")} aria-invalid={!!err("name")} aria-describedby={err("name") ? "c-name-err" : undefined} />
          {err("name") && <p id="c-name-err" className="mt-1 text-sm text-red-700">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="text-sm font-semibold">
            Email
          </label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={field("email")} aria-invalid={!!err("email")} aria-describedby={err("email") ? "c-email-err" : undefined} />
          {err("email") && <p id="c-email-err" className="mt-1 text-sm text-red-700">{err("email")}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-phone" className="text-sm font-semibold">
            Phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" className={field("phone")} />
        </div>
        <div>
          <label htmlFor="c-topic" className="text-sm font-semibold">
            Topic
          </label>
          <select id="c-topic" name="topic" defaultValue={defaultTopic} className={cn(field("topic"), "h-[3.125rem]")}>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="text-sm font-semibold">
          Message
        </label>
        <textarea id="c-message" name="message" rows={6} required className={field("message")} aria-invalid={!!err("message")} aria-describedby={err("message") ? "c-message-err" : undefined} />
        {err("message") && <p id="c-message-err" className="mt-1 text-sm text-red-700">{err("message")}</p>}
      </div>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClass("brand", "h-13 w-full sm:w-auto")}>
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        Send message
      </button>
      <p className="text-xs text-muted">We use your details only to reply to your message. See our privacy notice.</p>
    </form>
  );
}
