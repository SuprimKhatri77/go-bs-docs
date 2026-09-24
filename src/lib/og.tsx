import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getLanguage } from "@/lib/languages";
import { findDocsPage } from "@/lib/nav";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

// Rebuild the logo from icon.svg's paths with a fixed fill: that file themes
// itself with a prefers-color-scheme <style>, which the image renderer
// can't be relied on to honour.
async function logoDataUri() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8");
  const paths = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => `<path d="${m[1]}" fill="#f1efe9"/>`);
  const clean = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${paths.join("")}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(clean).toString("base64")}`;
}

/**
 * The shared Open Graph card. With no `href` it's the site-wide card;
 * with a docs href it shows that page's title and nav description.
 */
export async function ogImage(href?: string) {
  const page = href ? findDocsPage(href) : undefined;
  const language = page ? getLanguage(page.language) : undefined;
  if (href && !page) throw new Error(`ogImage: no docs nav entry for ${href}`);

  const title = page?.title ?? "Bikram Sambat date conversion for Go and TypeScript";
  const subtitle = page?.description ?? SITE_DESCRIPTION;
  const logo = await logoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#141311",
          color: "#f1efe9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by ImageResponse, not the browser */}
          <img src={logo} width={56} height={56} alt="" />
          <div style={{ fontSize: 40, fontWeight: 600 }}>{SITE_NAME}</div>
          {page && (
            <div style={{ fontSize: 32, color: "#a8a39a", marginLeft: 8 }}>
              {language && language.prefix ? `${language.name} docs` : "docs"}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          <div style={{ fontSize: 32, lineHeight: 1.4, color: "#a8a39a", maxWidth: 1000 }}>{subtitle}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
