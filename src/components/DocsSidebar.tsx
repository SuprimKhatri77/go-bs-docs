"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-5 text-sm">
      {docsNav.map((section) => (
        <div key={section.title}>
          <div className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {section.title}
          </div>
          <ul>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "block rounded-md px-2 py-1 transition-colors " +
                      (active ? "font-medium text-accent" : "text-muted hover:text-foreground")
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
