import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // There's no landing page: the docs are the site. /docs has no index page
  // of its own either, so both go straight to the first docs page.
  async redirects() {
    return [
      { source: "/", destination: "/docs/getting-started", permanent: true },
      { source: "/docs", destination: "/docs/getting-started", permanent: true },
    ];
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
