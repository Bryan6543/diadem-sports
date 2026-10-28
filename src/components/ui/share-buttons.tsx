"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { SocialIcon } from "./social-icons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, icon: "facebook" },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, icon: "whatsapp" },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow mr-1 text-muted">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener"
          className="grid size-10 place-items-center border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white"
          aria-label={`Share on ${l.label} (opens in a new tab)`}
        >
          {l.icon === "whatsapp" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
            </svg>
          ) : (
            <SocialIcon name={l.icon} width={18} height={18} />
          )}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard blocked */
          }
        }}
        className="grid size-10 place-items-center border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white"
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
