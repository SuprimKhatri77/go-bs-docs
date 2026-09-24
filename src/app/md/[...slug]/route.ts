import { allDocsPages } from "@/lib/nav";
import { docMarkdown } from "@/lib/markdown";

// Served at /docs/<page>.md via a rewrite in next.config.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return allDocsPages.map((item) => ({ slug: item.href.slice(1).split("/") }));
}

export async function GET(_request: Request, ctx: RouteContext<"/md/[...slug]">) {
  const { slug } = await ctx.params;
  return new Response(await docMarkdown(`/${slug.join("/")}`), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // The HTML page is the canonical, indexable version.
      "X-Robots-Tag": "noindex",
    },
  });
}
