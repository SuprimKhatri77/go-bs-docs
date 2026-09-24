"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import { LANGUAGES, languageFromPath } from "@/lib/languages";
import { docsNavFor } from "@/lib/nav";
import { toggleTheme } from "@/lib/theme";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const current = languageFromPath(usePathname());
  // The language being viewed first; other languages' pages are searchable too.
  const languages = [current, ...LANGUAGES.filter((l) => l.id !== current.id)];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (!typing && !open && e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleTheme();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:border-foreground/30 hover:text-foreground sm:flex"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search docs
        <kbd className="ml-4 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
        className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-foreground hover:border-foreground/30 sm:hidden"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search documentation"
        overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
        contentClassName="fixed left-1/2 top-24 z-50 w-[90vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Command.Input
            placeholder="Search docs..."
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No results.</Command.Empty>
          <Command.Item
            value="home"
            onSelect={() => go(`/docs${current.prefix}/getting-started`)}
            className="cursor-pointer rounded-md px-3 py-2 text-sm data-[selected=true]:bg-surface"
          >
            Home
          </Command.Item>
          {languages.flatMap((language) =>
            docsNavFor(language).map((section) => (
            <Command.Group
              key={`${language.id}-${section.title}`}
              heading={language.id === current.id ? section.title : `${language.name} · ${section.title}`}
              className="mt-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted"
            >
              {section.items.map((item) => (
                <Command.Item
                  key={item.href}
                  value={`${item.title} ${language.name} ${item.href}`}
                  onSelect={() => go(item.href)}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm data-[selected=true]:bg-surface"
                >
                  <div>{item.title}</div>
                  <div className="text-xs text-muted">{item.description}</div>
                </Command.Item>
              ))}
            </Command.Group>
            )),
          )}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
