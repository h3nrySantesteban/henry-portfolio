"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable; nothing to fall back to
    }
  }

  return (
    // Fixed-size placeholder: this is what participates in the flex row,
    // so it never resizes and siblings never move.
    <div className="relative h-7 w-[34px]">
      {/* Absolutely positioned and pinned to the right edge, so growing it
          on hover only extends further left instead of pushing layout. */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Copiar email"
        className={cn(
          "group absolute right-0 top-1/2 flex -translate-y-1/2 items-center transition-colors duration-300",
          copied ? "text-foreground/70" : "text-foreground",
        )}
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300 ease-out group-hover:max-w-[240px]">
          <span className="pr-2 text-sm">{copied ? "¡Copiado!" : email}</span>
        </span>
        {copied ? <Check size={34} className="shrink-0" /> : <Mail size={34} className="shrink-0" />}
      </button>
    </div>
  );
}
