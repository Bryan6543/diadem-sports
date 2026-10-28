"use client";

import { useRef } from "react";
import { gsap, reducedMotion, ScrollTrigger, useGSAP } from "@/animations/gsap";

/** Page transition: each navigation fades the new page in and refreshes scroll-triggered animations. */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      if (!reducedMotion()) gsap.fromTo(ref.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, clearProps: "transform" });
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => window.clearTimeout(t);
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
