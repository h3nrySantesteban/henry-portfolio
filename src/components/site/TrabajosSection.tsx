"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/database.types";

const CARET_SIZE = 16;
const CORNER_RADIUS = 16;

type CaretState = { mode: "top"; left: number } | { mode: "left" } | { mode: "right" };

export function TrabajosSection({ companies }: { companies: Company[] }) {
  const [selected, setSelected] = useState(0);
  const [caret, setCaret] = useState<CaretState | null>(null);
  const [isCarousel, setIsCarousel] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  // Where the last arrow press is heading, so a second quick tap keeps
  // advancing instead of re-reading the mid-animation scroll position.
  const pendingStep = useRef<{ target: number; at: number } | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const panel = panelRef.current;
    if (!scroller || !panel) return;

    const measure = () => {
      setIsCarousel(scroller.scrollWidth > scroller.clientWidth + 1);
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      setCanPrev(scroller.scrollLeft > 1);
      setCanNext(scroller.scrollLeft < maxScroll - 1);

      const btn = buttonRefs.current[selected];
      if (!btn) return;

      const btnRect = btn.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const btnCenter = btnRect.left + btnRect.width / 2;

      if (btnCenter < scrollerRect.left) {
        // Selected logo scrolled out of view to the left: point at the
        // panel's left edge instead of clamping the top caret in place.
        setCaret({ mode: "left" });
      } else if (btnCenter > scrollerRect.right) {
        setCaret({ mode: "right" });
      } else {
        // Keep the caret's whole base clear of the panel's rounded corners
        // (16px radius + 16px half-base), otherwise it floats over the curve.
        const inset = CORNER_RADIUS + CARET_SIZE;
        const center = btnCenter - panelRect.left;
        setCaret({ mode: "top", left: Math.min(Math.max(center, inset), panelRect.width - inset) });
      }
    };

    measure();

    // Logos are lazy-loaded, so buttons change width after mount: observe
    // every button (not just the scroller) to re-measure when they do.
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    observer.observe(panel);
    buttonRefs.current.forEach((btn) => btn && observer.observe(btn));

    scroller.addEventListener("scroll", measure);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [selected, companies.length]);

  if (companies.length === 0) return null;

  const active = companies[selected];

  // Moves one logo at a time to the real position of its neighbour (a fixed
  // pixel step drifted out of sync with the logos and never told you when you
  // had reached the end).
  function step(dir: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const origin = scroller.getBoundingClientRect().left - scroller.scrollLeft;
    const padding = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
    const lefts = buttonRefs.current.flatMap((btn) =>
      btn ? [btn.getBoundingClientRect().left - origin - padding] : [],
    );

    const pending = pendingStep.current;
    const from = pending && performance.now() - pending.at < 500 ? pending.target : scroller.scrollLeft;
    const target =
      dir === 1
        ? (lefts.find((l) => l > from + 8) ?? maxScroll)
        : (lefts.findLast((l) => l < from - 8) ?? 0);
    const clamped = Math.min(Math.max(target, 0), maxScroll);

    pendingStep.current = { target: clamped, at: performance.now() };
    scroller.scrollTo({ left: clamped, behavior: "smooth" });
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
            <CarouselArrow label="Anterior" disabled={!canPrev} onClick={() => step(-1)}>
              <ArrowLeft size={16} />
            </CarouselArrow>
            <CarouselArrow label="Siguiente" disabled={!canNext} onClick={() => step(1)}>
              <ArrowRight size={16} />
            </CarouselArrow>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          "flex items-center gap-3 overflow-x-auto overscroll-x-contain",
          isCarousel && "scrollbar-none px-1",
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
              "flex shrink-0 touch-manipulation items-center justify-center px-3 py-2 transition-opacity first:ml-auto last:mr-auto",
              i === selected ? "opacity-100" : "opacity-50 hover:opacity-80",
            )}
          >
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={140}
                height={56}
                className="h-14 w-auto max-w-36 object-contain"
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/50">{active.period}</span>
              {active.website_url && (
                <a
                  href={active.website_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Ver ${active.name}`}
                  className="shrink-0 text-foreground/50 transition-colors hover:text-foreground"
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>
          <p className="mt-4 whitespace-pre-line text-foreground/70">
            {active.description || "Próximamente más información sobre este puesto."}
          </p>
        </div>
      </div>
    </section>
  );
}

function CarouselArrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      // touch-manipulation: no double-tap-to-zoom when tapping the arrow twice quickly.
      className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-surface text-foreground/70 transition-[color,background-color,opacity] enabled:hover:bg-surface enabled:hover:text-foreground disabled:opacity-30"
    >
      {children}
    </button>
  );
}
