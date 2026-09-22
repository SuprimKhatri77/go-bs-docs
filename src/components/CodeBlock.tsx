import { codeToHtml } from "shiki";
import { StaticCopyButton } from "./StaticCopyButton";

export async function CodeBlock({
  code,
  lang = "go",
  title,
  copyable = true,
}: {
  code: string;
  lang?: string;
  title?: string;
  copyable?: boolean;
}) {
  const trimmed = code.trim();
  const html = await codeToHtml(trimmed, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border">
      {title && (
        <div className="border-b border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted">
          {title}
        </div>
      )}
      <div
        className="shiki-html overflow-x-auto bg-[var(--code-bg)] text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {copyable && <StaticCopyButton text={trimmed} />}
    </div>
  );
}
