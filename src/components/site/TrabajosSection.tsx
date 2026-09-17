"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/database.types";

export function TrabajosSection({ companies }: { companies: Company[] }) {
  const [selected, setSelected] = useState(0);

  if (companies.length === 0) return null;

  const active = companies[selected];

  return (
    <section id="trabajos" className="mx-auto max-w-4xl px-6 py-28">
      <div className="mb-14 text-center">
        <p className="text-sm font-medium text-foreground/50">Experiencia</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Empresas en las que trabajé
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {companies.map((company, i) => (
          <button
            key={company.id}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            className={cn(
              "flex h-16 w-40 items-center justify-center gap-2 rounded-xl border px-4 transition-colors",
              i === selected
                ? "border-surface bg-surface"
                : "border-surface/60 bg-transparent hover:border-surface hover:bg-surface/40",
            )}
          >
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={110}
                height={36}
                className="max-h-9 w-auto object-contain"
              />
            ) : (
              <span className="flex items-center gap-2 text-sm text-foreground/70">
                <Building2 size={16} />
                {company.name}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        key={active.id}
        className="mt-12 rounded-2xl border border-surface/70 bg-surface/20 p-8 sm:p-10"
      >
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
    </section>
  );
}
