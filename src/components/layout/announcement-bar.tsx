"use client";

import { useEffect, useState } from "react";

export function AnnouncementBar({ messages }: { messages: readonly string[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (messages.length < 2 || paused) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % messages.length), 5000);
    return () => window.clearInterval(t);
  }, [messages.length, paused]);

  if (!messages.length) return null;
  return (
    <div
      className="bg-brand-deep text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="container-x flex h-9 items-center justify-center text-center text-[0.72rem] font-semibold tracking-[0.08em]" aria-live="polite">
        <span key={i} className="animate-fade-in truncate">
          {messages[i]}
        </span>
      </p>
    </div>
  );
}
