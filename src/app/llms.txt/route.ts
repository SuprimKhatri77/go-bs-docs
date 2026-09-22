import { docsNav } from "@/lib/nav";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** The llms.txt index (https://llmstxt.org): each docs page's Markdown URL. */
export function GET() {
  const sections = docsNav
    .map(
      (section) =>
        `## ${section.title}\n\n` +
        section.items.map((item) => `- [${item.title}](${SITE_URL}${item.href}.md): ${item.description}`).join("\n"),
    )
    .join("\n\n");

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Import path: \`github.com/suprimkhatri77/go-bs\` (package \`bs\`). Every page below is also available as
one file at ${SITE_URL}/llms-full.txt.

${sections}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
