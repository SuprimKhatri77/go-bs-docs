import Link from "next/link";
import { LandingDemo } from "@/components/LandingDemo";
import { InstallCopy } from "@/components/InstallCopy";
import { CodeExamples } from "@/components/CodeExamples";

const FEATURES = [
  {
    title: "A real date type",
    body: (
      <>
        Not two converter functions. <code className="font-mono text-[13px]">bs.Date</code> does arithmetic,
        comparison, formatting and month boundaries.
      </>
    ),
  },
  {
    title: "Strict validation",
    body: (
      <>
        Every date is checked against its month&apos;s real length, not just its shape. Errors that work with{" "}
        <code className="font-mono text-[13px]">errors.Is</code>, never panics.
      </>
    ),
  },
  {
    title: "Timezone-safe",
    body: "Conversion reads only year, month and day. The same Gregorian date always yields the same BS date, in any location.",
  },
];

export default function Home() {
  return (
    <main>
      <section
        id="top"
        className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1140px] flex-col items-center justify-center px-5 py-16 text-center sm:px-8"
      >
        <h1 className="mx-auto max-w-[20ch] text-[clamp(44px,7vw,84px)] leading-[1.02] font-semibold tracking-tight text-balance">
          Bikram Sambat, computed correctly.
        </h1>
        <p className="mx-auto mt-7 max-w-[52ch] text-[19px] leading-relaxed text-muted text-pretty sm:text-[21px]">
          A Go library for Gregorian ↔ Bikram Sambat conversion, verified against Nepal&apos;s official calendar —
          not derived from a formula.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="inline-flex h-11 items-center rounded-[9px] bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <a
            href="https://pkg.go.dev/github.com/suprimkhatri77/go-bs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-[9px] border border-border px-5 text-[15px] text-muted transition-colors hover:border-muted hover:text-foreground"
          >
            pkg.go.dev reference →
          </a>
        </div>
        <div className="mt-7 flex justify-center">
          <InstallCopy />
        </div>
      </section>

      <section className="border-t border-border-soft">
        <div className="mx-auto max-w-[680px] px-5 py-[clamp(56px,8vw,96px)] sm:px-8">
          <LandingDemo />
        </div>
      </section>

      <div className="border-t border-b border-border-soft">
        <div className="mx-auto flex max-w-[1140px] flex-wrap gap-x-8 gap-y-2 px-5 py-4 font-mono text-xs text-muted sm:px-8">
          <span>BS 1979–2100</span>
          <span>44,562 days round-trip tested</span>
          <span>Zero dependencies, zero network calls</span>
        </div>
      </div>

      <section id="docs" className="mx-auto max-w-[1140px] px-5 py-[clamp(72px,10vw,132px)] sm:px-8">
        <div className="flex flex-wrap items-baseline gap-x-[18px] gap-y-2">
          <h2 className="text-[clamp(24px,2.6vw,30px)] font-semibold tracking-tight">Three snippets, the whole idea.</h2>
          <a
            href="https://pkg.go.dev/github.com/suprimkhatri77/go-bs"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            Full API reference →
          </a>
        </div>
        <CodeExamples />
      </section>

      <section className="border-t border-border-soft">
        <div className="mx-auto grid max-w-[1140px] gap-8 px-5 py-[clamp(72px,10vw,132px)] sm:grid-cols-3 sm:px-8 sm:gap-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="min-w-0">
              <h3 className="text-[16.5px] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted text-pretty">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="data" className="border-t border-border-soft">
        <div className="mx-auto max-w-[1140px] px-5 py-[clamp(72px,10vw,132px)] sm:px-8">
          <div className="max-w-[56ch]">
            <h2 className="text-[clamp(24px,2.6vw,30px)] font-semibold tracking-tight">Where the data comes from</h2>
            <p className="mt-[18px] text-base leading-relaxed text-muted text-pretty">
              BS month lengths are stored as a static, table-driven dataset rather than computed from a formula. The
              table was cross-checked against multiple open-source implementations and, where possible, against a
              live calendar source. Known limitations are documented.
            </p>
            <Link href="/docs/data-verification" className="mt-5 inline-block text-[14.5px] text-accent hover:underline">
              Sources and verification method →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
