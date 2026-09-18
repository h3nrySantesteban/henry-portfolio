"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

/**
 * Arrow-button behaviour for a horizontally scrolling row whose direct
 * children are the slides. Each press moves one slide at a time to its real
 * position (a fixed pixel step drifted out of sync with the slides) and
 * `canPrev` / `canNext` say when an end has been reached, so the arrows can
 * be disabled instead of silently doing nothing.
 */
export function useCarouselArrows(scrollerRef: RefObject<HTMLElement | null>, slideCount: number) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Where the last press is heading, so a second quick tap keeps advancing
  // instead of re-reading the mid-animation scroll position.
  const pendingStep = useRef<{ target: number; at: number } | null>(null);
  const snapPause = useRef<{ rearm: () => void; finish: () => void } | null>(null);

  // Scroll-snap fights a programmatic smooth scroll (Safari in particular
  // cancels or rewinds it), so snapping is switched off while an arrow's
  // animation runs and restored once the scrolling settles. Swiping with a
  // finger keeps its snap.
  function pauseSnap(scroller: HTMLElement) {
    if (snapPause.current) {
      snapPause.current.rearm();
      return;
    }

    scroller.style.scrollSnapType = "none";
    let timer: ReturnType<typeof setTimeout>;
    const finish = () => {
      clearTimeout(timer);
      scroller.style.scrollSnapType = "";
      scroller.removeEventListener("scroll", rearm);
      snapPause.current = null;
    };
    const rearm = () => {
      clearTimeout(timer);
      timer = setTimeout(finish, 150);
    };

    scroller.addEventListener("scroll", rearm);
    snapPause.current = { rearm, finish };
    rearm();
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const update = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      setCanPrev(scroller.scrollLeft > 1);
      setCanNext(scroller.scrollLeft < maxScroll - 1);
    };

    update();

    // Slides can change size after mount (lazy images), so watch them too.
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    Array.from(scroller.children).forEach((slide) => observer.observe(slide));

    scroller.addEventListener("scroll", update);
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", update);
      snapPause.current?.finish();
    };
  }, [scrollerRef, slideCount]);

  function step(dir: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const origin = scroller.getBoundingClientRect().left - scroller.scrollLeft;
    const padding = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
    const lefts = Array.from(scroller.children).map(
      (slide) => slide.getBoundingClientRect().left - origin - padding,
    );

    const pending = pendingStep.current;
    const from = pending && performance.now() - pending.at < 500 ? pending.target : scroller.scrollLeft;
    const target =
      dir === 1
        ? (lefts.find((l) => l > from + 8) ?? maxScroll)
        : (lefts.findLast((l) => l < from - 8) ?? 0);
    const clamped = Math.min(Math.max(target, 0), maxScroll);

    pendingStep.current = { target: clamped, at: performance.now() };
    pauseSnap(scroller);
    scroller.scrollTo({ left: clamped, behavior: "smooth" });
  }

  return { canPrev, canNext, step };
}

export function CarouselArrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
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
