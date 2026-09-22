"use client";

import { useRef } from "react";
import { CopyButton } from "./CopyButton";

/**
 * Wraps rehype-pretty-code's <pre> output with a copy button.
 *
 * rehype-pretty-code lays lines out with `display: grid` and one
 * `[data-line]` span per line — there's no literal "\n" character between
 * them in the DOM, so a naive `pre.textContent` read would smash every line
 * together. Reconstruct the newlines from the line elements instead.
 */
export function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);

  function getText(): string {
    const el = ref.current;
    if (!el) return "";
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    if (lines.length === 0) return el.textContent ?? "";
    return Array.from(lines)
      .map((line) => line.textContent ?? "")
      .join("\n");
  }

  return (
    <div className="group relative">
      <pre ref={ref} {...props} />
      <CopyButton getText={getText} />
    </div>
  );
}
