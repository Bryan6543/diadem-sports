"use client";

/* eslint-disable @next/next/no-img-element -- previews of arbitrary admin-entered URLs */
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState, useTransition } from "react";
import { Loader2, RotateCcw, Upload } from "lucide-react";
import { resetSiteImageAction, saveSiteImageAction, uploadSiteImageAction, type ActionResult } from "@/app/admin/actions";
import { resizeInBrowser } from "@/components/admin/resize-image";
import { logoSlotKeys, type SiteImageSlot } from "@/data/site-image-slots";
import { cn } from "@/lib/utils";

export function SiteImageCard({ slot, current, enabled }: { slot: SiteImageSlot; current: { src: string; alt: string } | null; enabled: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [msg, setMsg] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const [formState, formAction, saving] = useActionState<ActionResult | null, FormData>(async (prev, fd) => {
    const res = await saveSiteImageAction(prev, fd);
    if (res.ok) router.refresh();
    return res;
  }, null);

  const status = current ? "custom" : slot.defaultSrc ? "original" : "unset";
  const preview = current?.src ?? slot.defaultSrc;
  const isLogo = logoSlotKeys.has(slot.key);

  const upload = (file: File) =>
    start(async () => {
      const resized = await resizeInBrowser(file, isLogo ? 1200 : 2600, isLogo);
      const fd = new FormData();
      fd.set("key", slot.key);
      fd.set("file", resized);
      fd.set("alt", current?.alt ?? "");
      const res = await uploadSiteImageAction(fd);
      setMsg(res);
      if (res.ok) router.refresh();
    });

  const shown = msg ?? formState;

  return (
    <article className="flex flex-col bg-white">
      <div
        onDragOver={(e) => {
          if (!enabled) return;
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f && enabled) upload(f);
        }}
        className={cn(
          "relative grid aspect-[16/10] place-items-center overflow-hidden",
          isLogo ? "bg-ink" : "bg-mist",
          drag && "outline-2 outline-dashed outline-brand-deep",
        )}
      >
        {preview ? (
          <img src={preview} alt="" className={cn("h-full w-full", isLogo ? "object-contain p-8" : "object-cover")} />
        ) : (
          <span className="text-sm text-muted">{isLogo ? <span className="text-white/60">{slot.key === "logo" ? "Text logo in use" : "Text name in use"}</span> : "Nothing set — section uses its built-in design"}</span>
        )}
        <span
          className={cn(
            "absolute left-2 top-2 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
            status === "custom" ? "bg-brand-deep text-white" : status === "original" ? "bg-white text-ink" : "bg-accent text-ink",
          )}
        >
          {status === "custom" ? "Custom" : status === "original" ? "Original" : "Not set"}
        </span>
        {pending && (
          <span className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 aria-label="Uploading" className="size-6 animate-spin" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug">{slot.label}</h3>
        <p className="mt-1 text-xs text-muted">{slot.hint}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!enabled || pending}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-ink px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-deep disabled:opacity-40"
          >
            <Upload aria-hidden className="size-3.5" /> Upload new
          </button>
          {current && (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await resetSiteImageAction(slot.key);
                  setMsg(res);
                  if (res.ok) router.refresh();
                })
              }
              className="flex items-center gap-1.5 border border-ink/20 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:border-ink"
            >
              <RotateCcw aria-hidden className="size-3.5" /> {slot.defaultSrc ? "Reset" : "Remove"}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            aria-label={`Upload image for ${slot.label}`}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>

        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-xs font-semibold text-muted">Image URL &amp; alt text</summary>
          <form action={formAction} className="mt-2 space-y-2">
            <input type="hidden" name="key" value={slot.key} />
            <label className="block text-xs font-semibold" htmlFor={`src-${slot.key}`}>
              Image URL
            </label>
            <input id={`src-${slot.key}`} name="src" defaultValue={current?.src ?? ""} placeholder="https://…" className="h-9 w-full border border-ink/20 px-2 text-sm" />
            <label className="block text-xs font-semibold" htmlFor={`alt-${slot.key}`}>
              Alt text
            </label>
            <input
              id={`alt-${slot.key}`}
              name="alt"
              defaultValue={current?.alt ?? slot.defaultAlt}
              placeholder="Describe the image"
              className="h-9 w-full border border-ink/20 px-2 text-sm"
            />
            <button type="submit" disabled={!enabled || saving} className="border border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-ink hover:text-white disabled:opacity-40">
              Save
            </button>
          </form>
        </details>
        {shown && (
          <p role="status" className={cn("mt-2 text-xs", shown.ok ? "text-brand-deep" : "text-red-700")}>
            {shown.message}
          </p>
        )}
      </div>
    </article>
  );
}
