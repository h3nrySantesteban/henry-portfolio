"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function CvDownloadMenu({
  cvUrlEs,
  cvUrlEn,
}: {
  cvUrlEs: string | null;
  cvUrlEn: string | null;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const options = [
    { label: "Español", url: cvUrlEs, filename: "CV-Henry-Santesteban-ES.pdf" },
    { label: "English", url: cvUrlEn, filename: "CV-Henry-Santesteban-EN.pdf" },
  ].filter((o) => o.url);

  if (options.length === 0) return null;

  function toggle() {
    setOpen((v) => !v);
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="flex h-11 divide-x divide-background/15 overflow-hidden rounded-full bg-foreground text-background">
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-2 pl-5 pr-4 text-sm font-medium transition-opacity hover:opacity-90"
        >
          <Download size={16} />
          Descargar CV
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Mostrar idiomas"
          className="flex items-center px-4 transition-opacity hover:opacity-90"
        >
          <ChevronDown size={14} className={cn("transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>

      <div
        role="menu"
        className={cn(
          "absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-xl bg-foreground text-background shadow-lg divide-y divide-background/10 transition-[opacity,transform] duration-200",
          open
            ? "translate-y-0 opacity-100 ease-out"
            : "pointer-events-none -translate-y-2 opacity-0 ease-in",
        )}
      >
        {options.map((option) => (
          <a
            key={option.label}
            href={`${option.url}?download=${option.filename}`}
            target="_blank"
            rel="noreferrer noopener"
            download={option.filename}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-center text-sm font-medium text-background no-underline transition-colors hover:bg-background/10"
          >
            {option.label}
          </a>
        ))}
      </div>
    </div>
  );
}
