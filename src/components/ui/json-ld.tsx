import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl, cn } from "@/lib/utils";

/** Renders a JSON-LD script. `<` is escaped so content can never break out of the tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("eyebrow", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={tone === "light" ? "text-white" : "text-ink"}>
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className={cn(
                      "transition-colors",
                      tone === "light" ? "text-white/60 hover:text-white" : "text-muted hover:text-ink",
                    )}
                  >
                    {c.label}
                  </Link>
                )}
                {!last && <ChevronRight aria-hidden className={cn("size-3", tone === "light" ? "text-white/40" : "text-muted")} />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  );
}
