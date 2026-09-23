"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGUAGES, languageFromPath, type LanguageId } from "@/lib/languages";
import { counterpartHref } from "@/lib/nav";
import { GoIcon, TypeScriptIcon } from "./BrandIcons";

const LOGOS: Record<LanguageId, (p: { className?: string }) => React.ReactElement> = {
  go: GoIcon,
  ts: TypeScriptIcon,
};

/** The language's logo in its brand colour. */
export function LanguageLogo({ id, className }: { id: LanguageId; className?: string }) {
  const Logo = LOGOS[id];
  const color = LANGUAGES.find((l) => l.id === id)?.color;
  return (
    <span style={{ color }} className="inline-flex">
      <Logo className={className} />
    </span>
  );
}

const ChevronUpDown = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * Picks which language's docs to show: a button with the current language's
 * logo and name that opens a menu of languages. Each option links to the
 * same page in that language (or its getting-started page, if the current
 * page has no counterpart), so switching keeps your place.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const current = languageFromPath(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on a click outside, and on Escape (returning focus to the button).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function options(): HTMLAnchorElement[] {
    return Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitemradio"]') ?? []);
  }

  // Arrow keys move between options.
  function onMenuKeyDown(e: React.KeyboardEvent) {
    const items = options();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  // Opening from the keyboard focuses the current language.
  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => {
        const items = options();
        (items.find((item) => item.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
      });
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Language</div>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Documentation language: ${current.name}`}
        className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-left text-sm transition-colors hover:border-foreground/30"
      >
        <LanguageLogo id={current.id} className="size-5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-medium leading-tight text-foreground">{current.name}</span>
          <span className="block truncate font-mono text-[11px] leading-tight text-muted">{current.packageName}</span>
        </span>
        <span className="shrink-0 text-muted">
          <ChevronUpDown />
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Documentation language"
          onKeyDown={onMenuKeyDown}
          className="absolute inset-x-0 top-full z-50 mt-1 rounded-lg border border-border bg-background p-1 shadow-lg"
        >
          {LANGUAGES.map((language) => {
            const active = language.id === current.id;
            return (
              <Link
                key={language.id}
                href={counterpartHref(pathname, language)}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => setOpen(false)}
                className={
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-surface focus-visible:bg-surface " +
                  (active ? "text-foreground" : "text-muted hover:text-foreground")
                }
              >
                <LanguageLogo id={language.id} className="size-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium leading-tight">{language.name}</span>
                  <span className="block truncate font-mono text-[11px] leading-tight text-muted">
                    {language.packageName}
                  </span>
                </span>
                <span className={"shrink-0 " + (active ? "text-accent" : "invisible")}>
                  <Check />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
