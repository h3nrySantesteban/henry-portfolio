import { CopyEmailButton } from "@/components/site/CopyEmailButton";
import { CvDownloadMenu } from "@/components/site/CvDownloadMenu";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import type { SiteSettings } from "@/lib/database.types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const lines = settings.hero_heading.split("\n");

  return (
    // svh (not vh): on phones vh ignores the browser's URL/toolbars, so the hero
    // overflowed the visible screen. Minus the sticky header (5rem + 1px border).
    <section className="flex min-h-[calc(100svh-5rem-1px)] flex-col items-center justify-center px-6 text-center">
      <h1 data-hero-title className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
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
        <CopyEmailButton email={settings.email} />

        <a
          href={settings.github_url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="text-foreground transition-colors hover:text-foreground/60"
        >
          <GithubIcon size={29} />
        </a>

        {settings.linkedin_url && (
          <a
            href={settings.linkedin_url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="text-foreground transition-colors hover:text-foreground/60"
          >
            <LinkedinIcon size={28} />
          </a>
        )}

        <CvDownloadMenu cvUrlEs={settings.cv_url_es} cvUrlEn={settings.cv_url_en} />
      </div>
    </section>
  );
}
