"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatedLogo } from "@/components/site/AnimatedLogo";

const NAV_LINKS = [
  { href: "/#trabajos", label: "Trayectoria" },
  { href: "/#soluciones", label: "Soluciones" },
  { href: "/#blog", label: "Blog" },
];

// h-20 row + 1px bottom border.
const HEADER_HEIGHT = 81;

/**
 * `compactLogo`: show the logo as "HS" until the hero's big title (the element
 * marked `data-hero-title`) has scrolled up under the header, then unfold the
 * full name. Without it the full name is always shown.
 */
export function Header({ fullName, compactLogo = false }: { fullName: string; compactLogo?: boolean }) {
  const [open, setOpen] = useState(false);
  const [logoExpanded, setLogoExpanded] = useState(!compactLogo);

  useEffect(() => {
    if (!compactLogo) return;
    const title = document.querySelector("[data-hero-title]");
    if (!title) return;

    // The observed area starts below the header, so "not intersecting and
    // above it" means the title has scrolled away upwards (not just off-screen below).
    const observer = new IntersectionObserver(
      ([entry]) => setLogoExpanded(!entry.isIntersecting && entry.boundingClientRect.bottom <= HEADER_HEIGHT),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(title);
    return () => observer.disconnect();
  }, [compactLogo]);

  return (
    <header className="sticky top-0 z-50 border-b border-surface/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={(e) => {
            // Full page load (like F5) instead of a soft navigation, so it
            // always lands on a fresh home page at the top.
            e.preventDefault();
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign("/");
          }}
          aria-label={fullName}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          <AnimatedLogo fullName={fullName} expanded={logoExpanded} />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground/80 md:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-y border-surface/70 bg-background px-6 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-base text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
