import { cn, discountPercent, formatPrice } from "@/lib/utils";

export function Price({
  price,
  compareAt,
  className,
  size = "md",
  tone = "dark",
}: {
  price: number;
  compareAt: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  const off = discountPercent(price, compareAt);
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      <span
        className={cn(
          "font-mono font-medium",
          size === "lg" ? "text-3xl" : size === "md" ? "text-base" : "text-sm",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        <span className="sr-only">Price: </span>
        {formatPrice(price)}
      </span>
      {off > 0 && compareAt && (
        <>
          <s className={cn("font-mono text-sm", tone === "light" ? "text-white/50" : "text-muted")}>
            <span className="sr-only">Was </span>
            {formatPrice(compareAt)}
          </s>
          <span className="bg-accent px-1.5 py-0.5 font-mono text-[0.7rem] font-bold text-ink">−{off}%</span>
        </>
      )}
    </p>
  );
}
