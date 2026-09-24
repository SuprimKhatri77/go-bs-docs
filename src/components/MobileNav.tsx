"use client";

import { useState } from "react";
import Link from "next/link";
import { useSectionLinks } from "./SiteLinks";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const links = useSectionLinks();

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-foreground hover:border-foreground/30"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-14 border-b border-border bg-background px-4 py-3 shadow-sm">
          <ul className="space-y-1 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-foreground/90 hover:bg-surface"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
