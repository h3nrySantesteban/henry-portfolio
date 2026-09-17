import { Download } from "lucide-react";
import { CopyEmailButton } from "@/components/site/CopyEmailButton";
import { GithubIcon } from "@/components/icons/GithubIcon";
import type { SiteSettings } from "@/lib/database.types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const lines = settings.hero_heading.split("\n");

  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p className="mt-6 max-w-xl text-balance text-foreground/60 sm:text-lg">
        {settings.hero_subheading}
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={settings.github_url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-surface bg-surface/40 text-foreground transition-colors hover:bg-surface"
        >
          <GithubIcon size={18} />
        </a>

        {settings.cv_url && (
          <a
            href={settings.cv_url}
            target="_blank"
            rel="noreferrer noopener"
            download
            className="flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Download size={16} />
            Descargar CV
          </a>
        )}

        <CopyEmailButton email={settings.email} />
      </div>
    </section>
  );
}
