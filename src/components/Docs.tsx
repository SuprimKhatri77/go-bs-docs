export function DocsHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-10 border-b border-border pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{description}</p>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-10 text-xl font-semibold tracking-tight first:mt-0">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>;
}

export function Callout({ children, tone = "note" }: { children: React.ReactNode; tone?: "note" | "warn" }) {
  return (
    <div
      className={
        "my-4 rounded-lg border px-4 py-3 text-sm " +
        (tone === "warn"
          ? "border-accent/30 bg-accent/5 text-foreground"
          : "border-border bg-surface text-foreground/90")
      }
    >
      {children}
    </div>
  );
}

export function ApiEntry({
  signature,
  children,
}: {
  signature: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 rounded-lg border border-border">
      <div className="border-b border-border bg-surface px-4 py-2.5 font-mono text-sm">{signature}</div>
      <div className="px-4 py-4 text-sm leading-relaxed text-foreground/90 [&>p]:mb-3 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">{children}</code>
  );
}
