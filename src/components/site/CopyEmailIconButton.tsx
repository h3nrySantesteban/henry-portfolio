"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

type Stage = "mail" | "copy" | "check";

const ICONS: Record<Stage, typeof Mail> = { mail: Mail, copy: Copy, check: Check };

export function CopyEmailIconButton({ email, size = 18 }: { email: string; size?: number }) {
  const [stage, setStage] = useState<Stage>("mail");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(email);
      setStage("copy");
      setTimeout(() => setStage("check"), 300);
      setTimeout(() => setStage("mail"), 700);
    } catch {
      // clipboard API unavailable; nothing to fall back to
    }
  }

  const Icon = ICONS[stage];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Copiar email"
      className="transition-colors hover:text-foreground"
    >
      <Icon size={size} />
    </button>
  );
}
