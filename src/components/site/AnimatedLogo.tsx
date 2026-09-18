"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const UNFOLD_STAGGER_MS = 35;
const FOLD_STAGGER_MS = 20;

// `reveal` is the position in the unfolding order; null = always visible
// (the first letter of each word, which is what stays when compressed).
type Piece = { char: string; reveal: number | null };

function toPieces(fullName: string): Piece[] {
  let order = 0;
  return fullName
    .trim()
    .split(/\s+/)
    .flatMap((word, w) => {
      const pieces: Piece[] = [];
      if (w > 0) pieces.push({ char: " ", reveal: order++ });
      Array.from(word).forEach((char, i) => pieces.push({ char, reveal: i === 0 ? null : order++ }));
      return pieces;
    });
}

/** "HS" that unfolds letter by letter into the full name (and folds back). */
export function AnimatedLogo({ fullName, expanded }: { fullName: string; expanded: boolean }) {
  const pieces = useMemo(() => toPieces(fullName), [fullName]);
  const total = pieces.filter((p) => p.reveal !== null).length;

  // Each hidden letter animates its width up to its natural one, so measure them.
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [widths, setWidths] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (!cancelled) setWidths(letterRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0));
    };
    measure();
    // The webfont can land after mount and change the letter widths.
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [pieces]);

  return (
    <span aria-hidden="true" className="inline-flex whitespace-pre">
      {pieces.map((piece, i) => {
        if (piece.reveal === null) return <span key={i}>{piece.char}</span>;

        const delay = expanded
          ? piece.reveal * UNFOLD_STAGGER_MS
          : (total - 1 - piece.reveal) * FOLD_STAGGER_MS;
        // Before the widths are measured (server render) an expanded logo must
        // still show its letters, so it can't be clamped to 0.
        const maxWidth = expanded ? (widths?.[i] ?? "none") : 0;

        return (
          <span
            key={i}
            className="shrink-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none"
            style={{ maxWidth, opacity: expanded ? 1 : 0, transitionDelay: `${delay}ms` }}
          >
            <span
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
            >
              {piece.char}
            </span>
          </span>
        );
      })}
    </span>
  );
}
