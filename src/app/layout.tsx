import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { LogoProvider } from "@/components/ui/logo";
import { site } from "@/data/site";
import { getSiteImageOverride } from "@/lib/site-images";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Diadem Sri Lanka" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_LK",
    url: site.url,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint: marks JS as available (so GSAP can hide-then-reveal) and switches
 * motion off for prefers-reduced-motion or the ?motion=reduce QA switch (remembered for the tab).
 */
const motionScript = `(function(){var d=document.documentElement;try{var q=/[?&]motion=reduce/.test(location.search);if(q)sessionStorage.setItem('ds-motion','reduce');if(/[?&]motion=full/.test(location.search))sessionStorage.removeItem('ds-motion');if(q||sessionStorage.getItem('ds-motion')==='reduce'||matchMedia('(prefers-reduced-motion: reduce)').matches)d.setAttribute('data-motion','reduce');}catch(e){}d.classList.add('js');})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const logo = await getSiteImageOverride("logo");
  return (
    <html lang="en-LK" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <LogoProvider logo={logo}>{children}</LogoProvider>
      </body>
    </html>
  );
}
