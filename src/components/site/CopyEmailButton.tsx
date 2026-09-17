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
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex h-11 items-center rounded-full border border-surface bg-surface/40 pl-4 pr-4",
        "text-sm text-foreground transition-colors duration-300 hover:bg-surface",
      )}
    >
      {copied ? <Check size={16} className="shrink-0 text-foreground" /> : <Mail size={16} className="shrink-0" />}
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap">
          <span className="pl-2">{copied ? "¡Copiado!" : email}</span>
        </span>
      </span>
    </button>
  );
}
