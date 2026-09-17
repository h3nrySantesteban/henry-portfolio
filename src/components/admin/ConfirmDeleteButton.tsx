"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function ConfirmDeleteButton({
  onConfirm,
  label = "¿Eliminar este elemento? Esta acción no se puede deshacer.",
}: {
  onConfirm: () => Promise<void>;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!window.confirm(label)) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="Eliminar"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-surface hover:text-red-400 disabled:opacity-50"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
