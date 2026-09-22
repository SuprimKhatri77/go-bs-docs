import Link from "next/link";
import { Converter } from "@/components/Converter";
import { CodeBlock } from "@/components/CodeBlock";

const INSTALL_SNIPPET = `go get github.com/suprimkhatri77/go-bs`;

const USAGE_SNIPPET = `ad := time.Date(2026, time.September, 22, 0, 0, 0, 0, time.UTC)

d, _ := bs.ADToBS(ad)
fmt.Println(d) // 2083-06-06

next, _ := d.AddDays(10)
name, _ := d.MonthNameNepali()
fmt.Println(next, name) // 2083-06-16 असोज`;

const CHECKLIST = [
  "122 BS years covered (1979–2100)",
  "1,464 BS months represented",
  "Every supported BS date exhaustively tested",
  "AD → BS → AD and BS → AD → BS round-trip tested",
  "Zero runtime dependencies",
  "Zero network requests",
];

const FEATURES = [
  {
    title: "Verified calendar data",
    body: "BS month lengths follow Nepal's officially published calendar, not a formula. The dataset was cross-checked against multiple existing implementations and a live calendar source — see how.",
    href: "/docs/data-verification",
  },
  {
    title: "A real date type",
    body: "Arithmetic, comparison, formatting, Nepali digits, and calendar-grid helpers — not just two converter functions.",
    href: "/docs/api/arithmetic",
  },
  {
    title: "Strict validation",
    body: "Every date is checked against its month's real length, not just shape. Errors, not panics, throughout.",
    href: "/docs/api/errors",
  },
  {
    title: "Timezone-safe",
    body: "Conversion is based on calendar date only — time-of-day and location never change the result.",
    href: "/docs/api/conversion",
  },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Bikram Sambat dates,
            <br className="hidden sm:inline" /> done properly in Go.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            A dependency-free Go library for converting between Gregorian (AD) and
            Bikram Sambat (BS), Nepal&apos;s calendar — with verified calendar data
            and a complete, well-tested date API.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/getting-started"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <a
              href="https://pkg.go.dev/github.com/suprimkhatri77/go-bs"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
            >
              pkg.go.dev reference
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <Converter />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <CodeBlock lang="sh" title="Install" code={INSTALL_SNIPPET} />
          <CodeBlock lang="go" title="Usage" code={USAGE_SNIPPET} />
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <Link key={f.title} href={f.href} className="group block">
                <h3 className="font-medium group-hover:text-accent">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ul className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" width="16" height="16" className="shrink-0 text-accent" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4L8.5 12l6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
