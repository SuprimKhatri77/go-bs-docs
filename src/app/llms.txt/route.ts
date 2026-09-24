import { LANGUAGES } from "@/lib/languages";
import { docsNavFor } from "@/lib/nav";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const IMPORTS: Record<string, string> = {
  go: "Import path: `github.com/suprimkhatri77/go-bs` (package `bs`).",
  ts: "npm package: `bikram-sambat-ts` (ESM and CommonJS, zero dependencies).",
};

/** The llms.txt index (https://llmstxt.org): each docs page's Markdown URL, per language. */
export function GET() {
  const languages = LANGUAGES.map((language) => {
    const sections = docsNavFor(language)
      .map(
        (section) =>
          `### ${section.title}\n\n` +
          section.items.map((item) => `- [${item.title}](${SITE_URL}${item.href}.md): ${item.description}`).join("\n"),
      )
      .join("\n\n");
    return `## ${language.name}: ${language.packageName}\n\n${IMPORTS[language.id]}\n\n${sections}`;
  }).join("\n\n");

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

The same Bikram Sambat calendar library in ${LANGUAGES.map((l) => l.name).join(" and ")}, with identical
calendar data and results. Every page below is also available as one file at ${SITE_URL}/llms-full.txt.

${languages}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
