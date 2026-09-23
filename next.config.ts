import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { LANGUAGES, docsHref } from "./src/lib/languages";
import { allDocsPages, counterpartHref } from "./src/lib/nav";

/** A regex source matching any of `words`, case-insensitively and as the whole value. */
function anyOf(words: string[]): string {
  const caseless = (word: string) =>
    [...word].map((c) => (c.toLowerCase() === c.toUpperCase() ? c : `[${c.toLowerCase()}${c.toUpperCase()}]`)).join("");
  return `^(?:${words.map(caseless).join("|")})$`;
}

// `?lang=<language>` on any docs page redirects to that page in the given
// language (or to the language's getting-started page if it has no
// equivalent). Unknown values are ignored, and so is the language you're
// already on. Values are a language's id or one of its aliases (see
// src/lib/languages.ts), in any case: ?lang=ts, ?lang=TypeScript, ?lang=go.
function languageRedirects() {
  return allDocsPages.flatMap((page) =>
    LANGUAGES.filter((language) => language.id !== page.language).map((language) => ({
      source: page.href,
      has: [{ type: "query" as const, key: "lang", value: anyOf(language.aliases) }],
      destination: counterpartHref(page.href, language),
      permanent: false,
    })),
  );
}

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // There's no landing page: the docs are the site. /docs has no index page
  // of its own either, so both go straight to the first docs page.
  async redirects() {
    return [
      { source: "/", destination: "/docs/getting-started", permanent: true },
      { source: "/docs", destination: "/docs/getting-started", permanent: true },
      // Each other language's docs root goes to its own first page.
      ...LANGUAGES.filter((language) => language.prefix).map((language) => ({
        source: `/docs${language.prefix}`,
        destination: docsHref(language, "getting-started"),
        permanent: true,
      })),
      ...languageRedirects(),
    ];
  },
  // Markdown versions of the docs pages, for LLMs and agents.
  async rewrites() {
    return [{ source: "/docs/:path*.md", destination: "/md/docs/:path*" }];
  },
};

// Plugins are referenced by module name (string), not imported directly:
// Turbopack requires loader options to be JSON-serializable, and @next/mdx's
// Turbopack loader resolves string plugin names itself at build time.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap", properties: { className: ["anchor-heading"] } }],
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          defaultLang: "go",
          // Leave single-backtick inline code alone (plain monospace pill,
          // styled by .prose code in globals.css) — without this,
          // rehype-pretty-code wraps inline code the same way as fenced
          // blocks (a <span data-rehype-pretty-code-figure>, code given
          // display:grid), which breaks its inline layout.
          bypassInlineCode: true,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
