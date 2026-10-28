import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn, pad } from "@/lib/utils";

type Variant = "brand" | "dark" | "light" | "outline" | "outline-light" | "ghost";

const variants: Record<Variant, string> = {
  brand: "bg-brand-deep text-white hover:bg-ink",
  dark: "bg-ink text-white hover:bg-brand-deep",
  light: "bg-white text-ink hover:bg-brand-bright",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/70 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:text-brand-deep",
};

export const buttonClass = (variant: Variant = "brand", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] transition-colors duration-300 disabled:opacity-50",
    variants[variant],
    className,
  );

export function ButtonLink({
  variant = "brand",
  className,
  external,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; external?: boolean }) {
  if (external) {
    return (
      <a
        href={String(props.href)}
        target="_blank"
        rel="noopener"
        className={buttonClass(variant, className)}
        aria-label={props["aria-label"]}
      >
        {children}
        <ArrowUpRight aria-hidden className="size-4" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link {...props} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

export function Eyebrow({ index, children, className }: { index?: number; children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow text-brand-deep", className)}>
      {index != null && <span className="mr-2 opacity-70">{pad(index)} —</span>}
      {children}
    </p>
  );
}

/** Giant outlined word sitting behind a heading. Decorative. */
export function OutlineWord({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-display hollow pointer-events-none absolute select-none whitespace-nowrap text-[length:var(--text-giant)] leading-none opacity-35",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SampleBadge({ className, label = "Sample content" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn("eyebrow inline-flex items-center gap-1.5 bg-accent px-2.5 py-1 !text-[0.62rem] font-bold text-ink", className)}
      title="Placeholder content — replace before launch"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-ink" />
      {label}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  index?: number;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && (
        <Eyebrow index={index} className={tone === "light" ? "text-brand-bright" : undefined}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className={cn("font-display mt-4 text-5xl sm:text-6xl lg:text-7xl", tone === "light" ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 max-w-2xl text-lg leading-relaxed", tone === "light" ? "text-white/75" : "text-body", align === "center" && "mx-auto")}>
          {intro}
        </p>
      )}
    </div>
  );
}
