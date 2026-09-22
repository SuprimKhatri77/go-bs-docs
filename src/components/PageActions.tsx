"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { ClaudeIcon, CursorIcon, MarkdownIcon, OpenAIIcon } from "./BrandIcons";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

// T3 Chat has no Simple Icons entry; a generic chat bubble, as other docs sites use.
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

/** Deep links that start a new chat with a prompt pre-filled. */
const PROVIDERS = [
  { name: "ChatGPT", icon: <OpenAIIcon />, url: (q: string) => `https://chatgpt.com/?hints=search&prompt=${q}` },
  { name: "Claude", icon: <ClaudeIcon />, url: (q: string) => `https://claude.ai/new?q=${q}` },
  { name: "T3 Chat", icon: <ChatIcon />, url: (q: string) => `https://t3.chat/new?q=${q}` },
  { name: "Cursor", icon: <CursorIcon />, url: (q: string) => `https://cursor.com/link/prompt?text=${q}` },
];

function useFlash(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  return [
    on,
    () => {
      setOn(true);
      setTimeout(() => setOn(false), 1500);
    },
  ];
}

/**
 * "Copy Markdown" and "Open in" actions for a docs page, pointing LLMs at
 * the page's plain-Markdown version (/docs/<page>.md).
 */
export function PageActions() {
  const pathname = usePathname();
  const mdPath = `${pathname}.md`;
  const mdUrl = `${SITE_URL}${mdPath}`;
  const prompt = encodeURIComponent(
    `Read ${mdUrl}, the docs for the go-bs Go library (Bikram Sambat dates), so I can ask questions about it.`,
  );

  const [copiedMd, flashMd] = useFlash();
  const [copiedLink, flashLink] = useFlash();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function copyMarkdown() {
    const text = fetch(mdPath).then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.text();
    });
    try {
      // Handing ClipboardItem a promise keeps the write tied to the click
      // (Safari rejects clipboard writes that happen after an await).
      await navigator.clipboard.write([
        new ClipboardItem({ "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })) }),
      ]);
      flashMd();
    } catch {
      try {
        await navigator.clipboard.writeText(await text);
        flashMd();
      } catch {
        // Clipboard unavailable (e.g. non-HTTPS, permissions) — no-op.
      }
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(mdUrl);
      flashLink();
    } catch {
      // Clipboard unavailable — no-op.
    }
  }

  const button =
    "inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted transition-colors hover:border-foreground/30 hover:text-foreground";
  const item =
    "flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-[13px] text-foreground/85 hover:bg-surface-hover";
  const trailing = "ml-auto text-muted";

  return (
    <div className="not-prose flex items-center gap-2">
      <button type="button" onClick={copyMarkdown} className={button}>
        {copiedMd ? <CheckIcon /> : <CopyIcon />}
        {copiedMd ? "Copied" : "Copy Markdown"}
      </button>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={button}
        >
          Open in
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div
            role="menu"
            className="absolute right-0 z-30 mt-1.5 w-52 rounded-lg border border-border bg-background p-1 shadow-lg"
          >
            <button type="button" role="menuitem" onClick={copyLink} className={item}>
              {copiedLink ? <CheckIcon /> : <CopyIcon />}
              {copiedLink ? "Copied" : "Copy Markdown link"}
            </button>
            <a role="menuitem" href={mdPath} target="_blank" rel="noreferrer" className={item}>
              <MarkdownIcon />
              View as Markdown
              <span className={trailing}>
                <ExternalIcon />
              </span>
            </a>
            <div className="my-1 border-t border-border" />
            {PROVIDERS.map((p) => (
              <a
                key={p.name}
                role="menuitem"
                href={p.url(prompt)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className={item}
              >
                {p.icon}
                {p.name}
                <span className={trailing}>
                  <ExternalIcon />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
