"use client";

import { useState } from "react";

interface Example {
  key: string;
  label: string;
  file: string;
  caption: string;
  code: string;
  html: string;
}

export function CodeExamplesClient({ examples }: { examples: Example[] }) {
  const [active, setActive] = useState(examples[0].key);
  const [copied, setCopied] = useState(false);
  const current = examples.find((e) => e.key === active) ?? examples[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API unavailable — no-op.
    }
  }

  return (
    <div className="mt-[34px] grid items-start gap-6 sm:grid-cols-[minmax(0,300px)_1fr] lg:gap-10">
      <div className="flex min-w-0 flex-col gap-0.5">
        {examples.map((ex) => (
          <button
            key={ex.key}
            type="button"
            onClick={() => setActive(ex.key)}
            className={
              "block w-full rounded-[10px] border px-[15px] py-[13px] text-left transition-colors " +
              (ex.key === active ? "border-border bg-surface" : "border-transparent hover:bg-surface-hover")
            }
          >
            <div className="text-[14.5px] font-semibold tracking-tight">{ex.label}</div>
            <div className="mt-1 text-[13px] leading-snug text-muted">{ex.caption}</div>
          </button>
        ))}
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-[var(--code-bg)]">
        <div className="flex items-center justify-between border-b border-border-soft px-3.5 py-2.5 font-mono text-[11px] tracking-wider text-faint uppercase">
          <span>{current.file}</span>
          <button type="button" onClick={copy} className="cursor-pointer transition-colors hover:text-foreground">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div
          className="shiki-html overflow-x-auto px-[18px] py-4 text-[13px] [&_pre]:!bg-transparent [&_pre]:leading-[1.75]"
          dangerouslySetInnerHTML={{ __html: current.html }}
        />
      </div>
    </div>
  );
}
