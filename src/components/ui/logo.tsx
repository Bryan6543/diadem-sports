"use client";

/* eslint-disable @next/next/no-img-element -- admin-uploaded logos can be any size/format; a plain img keeps aspect ratio. */
import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

const LogoContext = createContext<ImageRef | null>(null);

/** Provides the admin-uploaded logo (if any) to every Logo on the page. */
export function LogoProvider({ logo, children }: { logo: ImageRef | null; children: ReactNode }) {
  return <LogoContext.Provider value={logo}>{children}</LogoContext.Provider>;
}

export function useLogo() {
  return useContext(LogoContext);
}

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const logo = useLogo();
  if (logo) {
    return <img src={logo.src} alt={logo.alt || "Diadem Sri Lanka"} className={cn("h-7 w-auto object-contain", className)} />;
  }
  return (
    <span className={cn("inline-flex items-baseline gap-2 leading-none", tone === "light" ? "text-white" : "text-ink", className)}>
      <span className="font-display text-[1.65rem] tracking-[0.06em]">Diadem</span>
      <span className={cn("eyebrow !text-[0.6rem] xl:max-2xl:[header_&]:hidden", tone === "light" ? "text-brand-bright" : "text-brand-deep")}>Sri Lanka</span>
    </span>
  );
}
