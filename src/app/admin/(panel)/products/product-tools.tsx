"use client";

import { useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { buttonClass } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { restoreSeedAction, syncAllPhotosAction, togglePublishAction } from "../../actions";

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [on, setOn] = useState(published);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Published — click to hide" : "Hidden — click to publish"}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await togglePublishAction(id, !on);
          if (res.ok) setOn(!on);
          else alert(res.message);
        })
      }
      className={cn("relative h-6 w-11 rounded-full transition-colors", on ? "bg-brand-deep" : "bg-ink/25", pending && "opacity-50")}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white transition-all", on ? "left-[1.375rem]" : "left-0.5")} />
    </button>
  );
}

export function SyncPhotosButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  return (
    <span className="flex items-center gap-3">
      {msg && (
        <span role="status" className="max-w-xs text-xs text-muted">
          {msg}
        </span>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Refresh photos, prices and stock for every product from unitedsports.lk? This replaces the current photos.")) return;
          start(async () => setMsg((await syncAllPhotosAction()).message));
        }}
        className={buttonClass("outline", "py-2.5")}
      >
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <RefreshCw aria-hidden className="size-4" />}
        Sync all photos
      </button>
    </span>
  );
}

export function RestoreSeedButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  return (
    <p className="text-sm text-muted">
      Deleted something by mistake?{" "}
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setMsg((await restoreSeedAction()).message))}
        className="font-semibold text-brand-deep underline underline-offset-4"
      >
        Restore missing products from the original catalogue
      </button>
      {msg && <span role="status"> — {msg}</span>}
    </p>
  );
}
