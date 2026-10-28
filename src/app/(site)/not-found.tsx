import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <span
        aria-hidden
        className="font-display hollow pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none text-[clamp(14rem,40vw,34rem)] leading-none text-white/10"
      >
        404
      </span>
      <div className="container-x relative py-28 lg:py-40">
        <p className="eyebrow text-brand-bright">Out of bounds</p>
        <h1 className="font-display mt-4 text-6xl sm:text-8xl">Page not found</h1>
        <p className="mt-6 max-w-lg text-lg text-white/75">That page has moved or never existed. Try the full range, or search for what you need.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/products" className={buttonClass("light")}>
            Browse products <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link href="/" className={buttonClass("outline-light")}>
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
