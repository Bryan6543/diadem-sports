"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap, reducedMotion, ScrollTrigger, SplitText, useGSAP } from "./gsap";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Start immediately instead of waiting for the element to scroll into view. */
  immediate?: boolean;
};

function show(el: Element) {
  gsap.set(el, { autoAlpha: 1, clearProps: "transform" });
}

/** Fades and lifts its content into view. */
export function Reveal({ children, className, as: Tag = "div", delay = 0, immediate }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reducedMotion()) return show(el);
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} data-animate className={className}>
      {children}
    </Tag>
  );
}

/** Masked line-by-line headline reveal using SplitText. */
export function SplitReveal({ children, className, as: Tag = "h2", delay = 0, immediate }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reducedMotion()) return show(el);
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.09,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true },
          onComplete: () => split?.revert(),
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} data-animate className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children marked with [data-stagger] into view. */
export function Stagger({ children, className, as: Tag = "div", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>("[data-stagger]");
      gsap.set(el, { autoAlpha: 1 });
      if (reducedMotion() || !items.length) return;
      gsap.from(items, {
        autoAlpha: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.07,
        delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} data-animate className={className}>
      {children}
    </Tag>
  );
}

/** Clip-path wipe for images. */
export function ImageReveal({ children, className, delay = 0, immediate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reducedMotion()) return show(el);
      gsap.fromTo(
        el,
        { autoAlpha: 1, clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.4,
          ease: "expo.inOut",
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
          onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
        },
      );
      const img = el.querySelector("img");
      if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.8, delay, scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true } });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} data-animate className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}

/** Scroll-linked vertical drift. `speed` is the % of the element's height to travel. */
export function Parallax({ children, className, speed = 12 }: { children: ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      gsap.fromTo(
        el,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
