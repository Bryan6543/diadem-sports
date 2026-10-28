"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClass } from "@/components/ui/primitives";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="bg-ink text-white">
      <div className="container-x py-28 lg:py-40">
        <p className="eyebrow text-brand-bright">Unforced error</p>
        <h1 className="font-display mt-4 text-6xl sm:text-8xl">Something went wrong</h1>
        <p className="mt-6 max-w-lg text-lg text-white/75">Sorry — this page didn&apos;t load properly. Please try again.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={buttonClass("light")}>
            Try again
          </button>
          <Link href="/" className={buttonClass("outline-light")}>
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
