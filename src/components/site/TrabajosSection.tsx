"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/database.types";

type CaretState = { mode: "top"; left: number } | { mode: "left" } | { mode: "right" };

export function TrabajosSection({ companies }: { companies: Company[] }) {
  const [selected, setSelected] = useState(0);
  const [caret, setCaret] = useState<CaretState | null>(null);
  const [isCarousel, setIsCarousel] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function checkOverflow() {
      if (!scroller) return;
      setIsCarousel(scroller.scrollWidth > scroller.clientWidth + 1);
    }

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [companies.length]);

  useEffect(() => {
    function updateCaret() {
      const btn = buttonRefs.current[selected];
      const panel = panelRef.current;
      const scroller = scrollerRef.current;
      if (!btn || !panel || !scroller) return;

      const btnRect = btn.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      if (btnRect.right <= scrollerRect.left) {
        // Selected logo scrolled out of view to the left: point at the
        // panel's left edge instead of clamping the top caret in place.
        setCaret({ mode: "left" });
      } else if (btnRect.left >= scrollerRect.right) {
        setCaret({ mode: "right" });
      } else {
        const center = btnRect.left + btnRect.width / 2 - panelRect.left;
        setCaret({ mode: "top", left: Math.min(Math.max(center, 24), panelRect.width - 24) });
      }
    }

    updateCaret();

    const scroller = scrollerRef.current;
    window.addEventListener("resize", updateCaret);
    scroller?.addEventListener("scroll", updateCaret);
    return () => {
      window.removeEventListener("resize", updateCaret);
      scroller?.removeEventListener("scroll", updateCaret);
    };
  }, [selected, companies.length, isCarousel]);

  if (companies.length === 0) return null;

  const active = companies[selected];

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  }

  return (
    <section id="trabajos" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-foreground/50">Experiencia</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Empresas en las que trabajé
          </h2>
        </div>

        {isCarousel && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface text-foreground/70 transition-colors hover:bg-surface hover:text-foreground"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface text-foreground/70 transition-colors hover:bg-surface hover:text-foreground"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          "flex items-center gap-3 overflow-x-auto",
          isCarousel
            ? "scrollbar-none snap-x snap-mandatory scroll-smooth px-1"
            : "justify-center",
        )}
      >
        {companies.map((company, i) => (
          <button
            key={company.id}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className={cn(
              "flex shrink-0 snap-start items-center justify-center px-3 py-2 transition-opacity",
              i === selected ? "opacity-100" : "opacity-50 hover:opacity-80",
            )}
          >
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={140}
                height={56}
                className="max-h-14 w-auto object-contain"
              />
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-foreground/70">
                <Building2 size={16} />
                {company.name}
              </span>
            )}
          </button>
        ))}
      </div>

      <div ref={panelRef} className="relative mt-12 rounded-2xl bg-surface/20 p-8 sm:p-10">
        {caret?.mode === "top" && (
          <div
            aria-hidden="true"
            className="absolute -top-4 h-0 w-0 border-x-[16px] border-x-transparent border-b-[16px] border-b-surface/20 transition-[left] duration-300 ease-out"
            style={{ left: caret.left, transform: "translateX(-50%)" }}
          />
        )}
        {caret?.mode === "left" && (
          <div
            aria-hidden="true"
            className="absolute -left-4 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[16px] border-y-transparent border-r-[16px] border-r-surface/20"
          />
        )}
        {caret?.mode === "right" && (
          <div
            aria-hidden="true"
            className="absolute -right-4 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[16px] border-y-transparent border-l-[16px] border-l-surface/20"
          />
        )}

        <div key={active.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-medium">
              {active.role} · {active.name}
            </h3>
            <span className="text-sm text-foreground/50">{active.period}</span>
          </div>
          <p className="mt-4 whitespace-pre-line text-foreground/70">
            {active.description || "Próximamente más información sobre este puesto."}
          </p>
        </div>
      </div>
    </section>
  );
}
