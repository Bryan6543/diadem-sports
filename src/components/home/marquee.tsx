import { cn } from "@/lib/utils";

export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="font-display flex items-center whitespace-nowrap px-6 text-4xl sm:text-6xl">
          {t}
          <span aria-hidden className="ml-12 inline-block size-3 rotate-45 bg-current opacity-60" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("overflow-hidden border-y border-ink/10 py-6", className)}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
