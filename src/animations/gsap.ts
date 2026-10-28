"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** GSAP plugins are registered once, here. Import gsap from this module everywhere. */
let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  registered = true;
}

/** True when the visitor prefers reduced motion or the page was opened with ?motion=reduce. */
export function reducedMotion() {
  if (typeof document === "undefined") return true;
  return document.documentElement.dataset.motion === "reduce";
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
