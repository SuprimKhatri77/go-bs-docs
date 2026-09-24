"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsHref, languageFromPath } from "@/lib/languages";

/** The header's section links, for the language currently being viewed. */
export function useSectionLinks() {
  const language = languageFromPath(usePathname());
  return [
    { href: docsHref(language, "getting-started"), label: "Docs" },
    { href: docsHref(language, "api/conversion"), label: "API reference" },
    { href: docsHref(language, "data-verification"), label: "Calendar data" },
  ];
}

export function HeaderLinks() {
  const links = useSectionLinks();
  return (
    <nav className="hidden items-center gap-5 text-sm text-muted sm:flex">
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="transition-colors hover:text-foreground">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function HomeLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const language = languageFromPath(usePathname());
  return (
    <Link href={docsHref(language, "getting-started")} className={className}>
      {children}
    </Link>
  );
}

export function GitHubLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const language = languageFromPath(usePathname());
  return (
    <a
      href={language.repoUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`${language.packageName} on GitHub`}
      className={className}
    >
      {children}
    </a>
  );
}

const footerLink = "underline decoration-border underline-offset-4 hover:text-foreground";

export function Footer() {
  const language = languageFromPath(usePathname());
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted">
      MIT licensed.{" "}
      <a href={language.repoUrl} target="_blank" rel="noreferrer" className={footerLink}>
        Source
      </a>{" "}
      ·{" "}
      <a href={language.registry.url} target="_blank" rel="noreferrer" className={footerLink}>
        {language.registry.name}
      </a>
    </footer>
  );
}
