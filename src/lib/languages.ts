/**
 * The programming languages these docs cover. Each has its own pages and
 * sidebar, served under its own URL prefix. The default language (Go, the
 * first entry) has no prefix, so the original go-bs URLs never changed:
 *
 *   /docs/api/conversion      Go
 *   /docs/ts/api/conversion   TypeScript
 *
 * Adding a language: add an entry here, its pages under
 * src/app/docs/<id>/, and its sidebar in nav.ts.
 *
 * Imported by next.config.ts, so this file must only use relative imports.
 */

export type LanguageId = "go" | "ts";

export interface Language {
  id: LanguageId;
  /** Shown in the language switcher. */
  name: string;
  /** The package this language's docs are for. */
  packageName: string;
  /** URL prefix after /docs: "" for the default language, else "/<id>". */
  prefix: string;
  /** Values accepted in `?lang=`, lowercase (matching is case-insensitive). */
  aliases: string[];
  repoUrl: string;
  registry: { name: string; url: string };
  /** Brand colour of the language's logo. */
  color: string;
}

export const LANGUAGES: Language[] = [
  {
    id: "go",
    name: "Go",
    packageName: "go-bs",
    prefix: "",
    aliases: ["go", "golang"],
    repoUrl: "https://github.com/suprimkhatri77/go-bs",
    registry: { name: "pkg.go.dev", url: "https://pkg.go.dev/github.com/suprimkhatri77/go-bs" },
    color: "#00ADD8",
  },
  {
    id: "ts",
    name: "TypeScript",
    packageName: "bikram-sambat-ts",
    prefix: "/ts",
    aliases: ["ts", "typescript", "js", "javascript"],
    repoUrl: "https://github.com/SuprimKhatri77/bikram-sambat-ts",
    registry: { name: "npm", url: "https://www.npmjs.com/package/bikram-sambat-ts" },
    color: "#3178C6",
  },
];

export const DEFAULT_LANGUAGE: Language = LANGUAGES[0];

export function getLanguage(id: LanguageId): Language {
  const language = LANGUAGES.find((l) => l.id === id);
  if (!language) throw new Error(`unknown language ${id}`);
  return language;
}

/** The language a /docs pathname belongs to, going by its prefix. */
export function languageFromPath(pathname: string): Language {
  return (
    LANGUAGES.find((l) => l.prefix && (pathname === `/docs${l.prefix}` || pathname.startsWith(`/docs${l.prefix}/`))) ??
    DEFAULT_LANGUAGE
  );
}

/** A docs page's path in a language, e.g. ("ts", "api/conversion") → "/docs/ts/api/conversion". */
export function docsHref(language: Language, slug: string): string {
  return `/docs${language.prefix}/${slug}`;
}

/** The language-independent part of a docs path: "/docs/ts/api/conversion" → "api/conversion". */
export function slugFromPath(pathname: string): string {
  const language = languageFromPath(pathname);
  return pathname.slice(`/docs${language.prefix}/`.length);
}
