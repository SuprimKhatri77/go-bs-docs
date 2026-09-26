"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    // Headings inside live demos (e.g. a calendar's visually hidden month
    // title) belong to the demo, not to the page's outline.
    const elements = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2, h3")).filter(
      (el) => !el.closest(".not-prose"),
    );
    // The heading list only exists once MDX content has rendered into the
    // DOM (there's no React state it's derived from) and is static per
    // page, so a one-time post-mount read is the actual external system
    // here, not a case of syncing React state back into itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H3" ? 3 : 2,
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <nav className="text-sm">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">On this page</div>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              style={{ paddingLeft: h.level === 3 ? "1.5rem" : "0.75rem" }}
              className={
                "block border-l transition-colors " +
                (activeId === h.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-border text-muted hover:text-foreground")
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
