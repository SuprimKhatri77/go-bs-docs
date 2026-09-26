import { allDocsPages } from "@/lib/nav";
import { docMarkdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Every docs page's Markdown in sidebar order, for loading the whole docs
 * into context at once: all Go pages, then TypeScript, then React.
 */
export async function GET() {
  const pages = await Promise.all(
    allDocsPages.map(async (item) => `<!-- Source: ${SITE_URL}${item.href} -->\n\n${await docMarkdown(item.href)}`),
  );
  return new Response(pages.join("\n---\n\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
