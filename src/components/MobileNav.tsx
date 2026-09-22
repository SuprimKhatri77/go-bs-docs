"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/docs/getting-started", label: "Docs" },
  { href: "/docs/api/conversion", label: "API reference" },
  { href: "/docs/data-verification", label: "Calendar data" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

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
            {LINKS.map((link) => (
              <li key={link.href}>
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
