"use client";

import { usePathname, useRouter } from "next/navigation";
import { languageFromPath } from "@/lib/languages";
import { docsNavFor } from "@/lib/nav";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MobileDocsNav() {
  const router = useRouter();
  const pathname = usePathname();
  const pages = docsNavFor(languageFromPath(pathname)).flatMap((section) => section.items);

  return (
    <div className="mb-6 space-y-3 lg:hidden">
      <LanguageSwitcher />
      <select
        value={pathname}
        onChange={(e) => router.push(e.target.value)}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
        aria-label="Jump to a docs page"
      >
        {pages.map((item) => (
          <option key={item.href} value={item.href}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  );
}
