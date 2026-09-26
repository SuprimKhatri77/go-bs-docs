import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_URL } from "@/lib/site";

/**
 * Plain-Markdown versions of the docs pages, for LLMs and agents (served at
 * /docs/<page>.md, /llms.txt and /llms-full.txt). Converted from each page's
 * MDX source at build time: our handful of components are rewritten to their
 * Markdown equivalents, and interactive-only sections are dropped.
 *
 * This is a small line-oriented converter for the components this site
 * actually uses, not a general MDX-to-Markdown tool — it throws if any JSX
 * survives, so a new component can't silently leak into the output.
 */

/** Components that only make sense in a browser; a `##` section containing one is dropped. */
const INTERACTIVE = ["MonthCalendarWidget", "MonthCalendarWidgetTS"];

/**
 * Live demos that sit next to the code they run (the React pages); only
 * the component line itself is dropped, since the surrounding code and text
 * still make sense without it.
 */
const INLINE_INTERACTIVE = ["ReactDemo"];

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g)) out[m[1]] = m[2] ?? m[3];
  return out;
}

/**
 * Strips common indentation per paragraph: MDX component bodies mix
 * indented and flush paragraphs (see the Callouts), so one shared minimum
 * would leave the indented ones indented.
 */
function dedent(text: string): string {
  return text
    .split(/\n[ \t]*\n/)
    .map((para) => {
      const lines = para.split("\n");
      const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length);
      const min = indents.length ? Math.min(...indents) : 0;
      return lines.map((l) => l.slice(min)).join("\n");
    })
    .join("\n\n");
}

function absoluteLinks(md: string): string {
  // Internal doc links point at the Markdown version, absolute so they work
  // wherever the text ends up.
  return md.replace(/\]\((\/docs\/[^)#\s]+)(#[^)\s]*)?\)/g, (_, path, hash = "") => `](${SITE_URL}${path}.md${hash})`);
}

export function mdxToMarkdown(source: string): string {
  let md = source;

  // Imports and the metadata export.
  md = md.replace(/^import .*$/gm, "");
  md = md.replace(/^export const metadata = [\s\S]*?\n\}\);?$/m, "");

  // Protect fenced code blocks from the component rewrites below; strip
  // rehype-pretty-code meta (e.g. title="main.go") from the fence.
  const fences: string[] = [];
  md = md.replace(/^```(\w*)[^\n]*\n[\s\S]*?^```$/gm, (block, lang) => {
    fences.push(block.replace(/^```[^\n]*/, "```" + lang));
    return `\u0000FENCE${fences.length - 1}\u0000`;
  });

  // Inline code is literal text too: `<NepaliCalendar />` in a sentence isn't
  // a component to convert (or to flag as unconverted).
  const inline: string[] = [];
  md = md.replace(/`[^`\n]+`/g, (code) => {
    inline.push(code);
    return `\u0000CODE${inline.length - 1}\u0000`;
  });

  // Interactive-only sections.
  md = md
    .split(/(?=^## )/m)
    .filter((section) => !INTERACTIVE.some((name) => section.includes(`<${name}`)))
    .join("");

  for (const name of INLINE_INTERACTIVE) {
    md = md.replace(new RegExp(`^[ \\t]*<${name}\\b[^>]*\\/>[ \\t]*$`, "gm"), "");
  }

  md = md.replace(/<DocsHeader([\s\S]*?)\/>/g, (_, a) => {
    const { title, description } = attrs(a);
    return `# ${title}\n\n${description}`;
  });

  md = md.replace(/<ApiEntry((?:\s+\w+=(?:"[^"]*"|'[^']*'))+)\s*>([\s\S]*?)<\/ApiEntry>/g, (_, a, body) => {
    const { signature, lang = "go" } = attrs(a);
    // The signature becomes a code block, protected like the others: TypeScript
    // generics (`ButtonHTMLAttributes<HTMLButtonElement>`) aren't components.
    fences.push("```" + lang + "\n" + signature.trim() + "\n```");
    return `\u0000FENCE${fences.length - 1}\u0000\n\n` + dedent(body).trim();
  });

  md = md.replace(/<Callout([^>]*)>([\s\S]*?)<\/Callout>/g, (_, a, body) => {
    const kind = attrs(a).tone === "warn" ? "WARNING" : "NOTE";
    const lines = dedent(body).trim().split("\n");
    return [`> [!${kind}]`, ...lines.map((l) => (l ? `> ${l}` : ">"))].join("\n");
  });

  const leftover = md.match(/<\/?[A-Z]\w*/);
  if (leftover) throw new Error(`mdxToMarkdown: unconverted component ${leftover[0]}`);

  md = md.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => inline[Number(i)]);
  md = md.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[Number(i)]);
  md = absoluteLinks(md);
  return md.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/** The Markdown for a docs page, e.g. "/docs/api/conversion". */
export async function docMarkdown(href: string): Promise<string> {
  const source = await readFile(join(process.cwd(), "src/app", href, "page.mdx"), "utf8");
  return mdxToMarkdown(source);
}
