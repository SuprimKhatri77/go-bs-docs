"use client";

import { usePathname, useRouter } from "next/navigation";
import { flatDocsNav } from "@/lib/nav";

export function MobileDocsNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={pathname}
      onChange={(e) => router.push(e.target.value)}
      className="mb-6 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm lg:hidden"
      aria-label="Jump to a docs page"
    >
      {flatDocsNav.map((item) => (
        <option key={item.href} value={item.href}>
          {item.title}
        </option>
      ))}
    </select>
  );
}
