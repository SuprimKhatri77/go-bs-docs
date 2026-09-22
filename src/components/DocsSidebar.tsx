"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6 text-sm">
      {docsNav.map((section) => (
        <div key={section.title}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {section.title}
          </div>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "block rounded-md px-2 py-1.5 transition-colors " +
                      (active
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-muted hover:bg-surface hover:text-foreground")
                    }
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
