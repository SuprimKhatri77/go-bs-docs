import { codeToHtml } from "shiki";

export function DocsHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{description}</p>
    </div>
  );
}

export function Callout({ children, tone = "note" }: { children: React.ReactNode; tone?: "note" | "warn" }) {
  return (
    <div
      className={
        "my-4 flex gap-2.5 rounded-lg border px-4 py-3 text-sm " +
        (tone === "warn" ? "border-amber-500/30 bg-amber-500/[0.06]" : "border-border bg-surface")
      }
    >
      <span className="mt-0.5 shrink-0 text-muted">{tone === "warn" ? "⚠" : "ⓘ"}</span>
      <div className="[&>p]:mb-0">{children}</div>
    </div>
  );
}

/** A function/method/type signature, styled as a small mono heading — not a bordered card. */
export async function ApiEntry({ signature, children }: { signature: string; children: React.ReactNode }) {
  const html = await codeToHtml(signature.trim(), {
    lang: "go",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className="mb-8 border-t border-border pt-5 first:mt-0 first:border-0 first:pt-0">
      <div
        className="shiki-html mb-2 overflow-x-auto rounded-md bg-surface px-3 py-2 text-[13px] [&_pre]:!bg-transparent [&_pre]:whitespace-pre [&_pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="text-sm leading-relaxed text-foreground/80 [&>p]:mb-3 [&>p:last-child]:mb-0">{children}</div>
    </div>
  );
}
