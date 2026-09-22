"use client";

import { useState } from "react";

const INSTALL = "go get github.com/suprimkhatri77/go-bs";

export function InstallCopy() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API unavailable — no-op.
    }
  }

  return (
    <div className="flex w-full max-w-[460px] items-stretch overflow-hidden rounded-[10px] border border-border bg-[var(--code-bg)]">
      <code className="min-w-0 flex-1 overflow-x-auto px-3.5 py-3 font-mono text-[13.5px] whitespace-nowrap">
        {INSTALL}
      </code>
      <button
        type="button"
        onClick={copy}
        className="w-[76px] shrink-0 border-l border-border font-mono text-[11px] tracking-wider text-muted uppercase transition-colors hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
