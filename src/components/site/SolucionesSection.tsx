"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import type { Solution } from "@/lib/database.types";

export function SolucionesSection({ solutions }: { solutions: Solution[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (solutions.length === 0) return null;

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  }

  return (
    <section id="soluciones" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-foreground/50">Soluciones</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Proyectos personales
          </h2>
        </div>

        {solutions.length > 2 && (
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
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
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
            <p className="mt-2 text-foreground/60">{solution.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
