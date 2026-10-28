"use client";

import { useActionState } from "react";
import { setSubscriptionAction, type FormState } from "@/app/actions";
import { buttonClass } from "@/components/ui/primitives";

export function UnsubscribeForm({ token, email, active }: { token: string; email: string; active: boolean }) {
  const [state, action, pending] = useActionState<FormState | null, FormData>(setSubscriptionAction, null);
  const isActive = state?.ok ? /subscribed again/.test(state.message) : active;
  return (
    <div>
      <p className="text-lg text-body">
        <span className="font-semibold text-ink">{email}</span> is currently{" "}
        <strong className="text-ink">{isActive ? "subscribed" : "unsubscribed"}</strong>.
      </p>
      {state && (
        <p role="status" className={`mt-4 ${state.ok ? "text-brand-deep" : "text-red-700"}`}>
          {state.message}
        </p>
      )}
      <form action={action} className="mt-8">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="action" value={isActive ? "unsubscribe" : "resubscribe"} />
        <button type="submit" disabled={pending} className={buttonClass(isActive ? "outline" : "brand")}>
          {isActive ? "Unsubscribe" : "Resubscribe"}
        </button>
      </form>
    </div>
  );
}
