import { codeToHtml } from "shiki";

export async function CodeBlock({
  code,
  lang = "go",
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {title && (
        <div className="border-b border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted">
          {title}
        </div>
      )}
      <div
        className="overflow-x-auto bg-[var(--code-bg)] text-sm [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
