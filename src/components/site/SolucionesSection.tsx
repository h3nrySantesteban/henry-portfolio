"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarouselArrow, useCarouselArrows } from "@/components/site/carousel";
import type { Solution } from "@/lib/database.types";

export function SolucionesSection({ solutions }: { solutions: Solution[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { canPrev, canNext, step } = useCarouselArrows(scrollerRef, solutions.length);

  if (solutions.length === 0) return null;

  function handleToggle(id: string) {
    if (expandedIds.has(id)) {
      // Closing any open one closes them all, and scrolls back up to the
      // section: the same spot the "Soluciones" nav link lands on.
      setExpandedIds(new Set());
      document.getElementById("soluciones")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Opening only expands the selected one; the others are left as they are.
      setExpandedIds((prev) => new Set(prev).add(id));
    }
  }

  return (
    <section id="soluciones" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-foreground/50">Soluciones</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Proyectos</h2>
        </div>

        {solutions.length > 2 && (
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
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2"
      >
        {solutions.map((solution) => (
          <article
            key={solution.id}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface/40">
              {solution.image_url ? (
                <Image
                  src={solution.image_url}
                  alt={solution.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 85vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-foreground/30">
                  <Layers size={40} />
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <h3 className="text-lg font-medium">{solution.title}</h3>
              {solution.project_url && (
                <a
                  href={solution.project_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Ver ${solution.title}`}
                  className="mt-1 shrink-0 text-foreground/50 transition-colors hover:text-foreground"
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
            <ExpandableDescription
              text={solution.description}
              expanded={expandedIds.has(solution.id)}
              onToggle={() => handleToggle(solution.id)}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

const COLLAPSED_HEIGHT = 72;

function ExpandableDescription({
  text,
  expanded,
  onToggle,
}: {
  text: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [fullHeight, setFullHeight] = useState(COLLAPSED_HEIGHT);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) setFullHeight(textRef.current.scrollHeight);
  }, [text]);

  const isClamped = fullHeight > COLLAPSED_HEIGHT;

  return (
    <div className="mt-2">
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: expanded ? fullHeight : COLLAPSED_HEIGHT }}
      >
        <p ref={textRef} className="text-foreground/60">
          {text}
        </p>
        {!expanded && isClamped && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      {isClamped && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? "Ver menos" : "Ver más"}
          className="mx-auto mt-1 flex h-6 w-6 items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
        >
          <ChevronDown size={16} className={cn("transition-transform duration-300", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  );
}
