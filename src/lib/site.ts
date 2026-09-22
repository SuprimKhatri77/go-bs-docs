import type { Metadata } from "next";

export const SITE_URL = "https://go-bs.suprimkhatri.com.np";
export const SITE_NAME = "go-bs";
export const SITE_TITLE = "go-bs — Bikram Sambat date conversion for Go";
export const SITE_DESCRIPTION =
  "A dependency-free Go library for converting dates between Gregorian (AD) and Bikram Sambat (BS), Nepal's calendar. Supports BS 1979–2100 with verified calendar data.";
export const GITHUB_URL = "https://github.com/suprimkhatri77/go-bs";
export const PKG_GO_DEV_URL = "https://pkg.go.dev/github.com/suprimkhatri77/go-bs";
export const AUTHOR = { name: "Suprim Khatri", url: "https://github.com/suprimkhatri77" };
export const FEED_ALTERNATES = {
  "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} docs` }],
};

/**
 * Metadata for a docs page: title, description, canonical URL and Open Graph
 * fields. Child `openGraph` and `alternates` replace the root layout's rather
 * than merging with them, so the shared fields are repeated here.
 */
export function docsMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, types: FEED_ALTERNATES },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: `${title} — ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE_NAME}`,
      description,
    },
  };
}
