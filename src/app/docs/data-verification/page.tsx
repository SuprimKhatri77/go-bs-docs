import { DocsHeader, H2, P, Callout, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Calendar data: sources & verification" };

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Calendar data: sources & verification"
        description="Where go-bs's calendar data comes from, and why library agreement alone wasn't enough evidence to trust it."
      />

      <P>
        go-bs supports Bikram Sambat years <strong>1979–2100</strong> inclusive. BS month lengths are not computed
        from a formula — they follow Nepal&apos;s officially published calendar and are recorded as a static,
        table-driven dataset in <InlineCode>data.go</InlineCode>.
      </P>

      <H2>Why this needed real verification</H2>
      <P>
        Every BS/AD converter is only as good as its calendar data. While researching this package, three actively
        used, independent open-source calendar libraries were compared against each other and against a live
        authoritative source — and <strong>all three were found to contain real errors</strong> in at least a few
        individual years. Two libraries agreeing with each other was not, by itself, reliable evidence of
        correctness — two projects can share a common (and equally wrong) upstream data table.
      </P>

      <H2>Sources consulted</H2>
      <ul className="mb-4 list-disc space-y-2 pl-5 text-foreground/90">
        <li>
          <a href="https://github.com/amitgaru/nepali-datetime" target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
            amitgaru/nepali-datetime
          </a>{" "}
          (Python, Apache-2.0) — a CSV of BS month lengths for 1975–2100.
        </li>
        <li>
          <a href="https://github.com/askbuddie/bikram-sambat" target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
            askbuddie/bikram-sambat
          </a>{" "}
          (TypeScript, MIT) — an explicit day-count table for 1975–2100.
        </li>
        <li>
          <a href="https://github.com/puncoz-official/bikram-sambat-js" target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
            puncoz-official/bikram-sambat-js
          </a>{" "}
          (TypeScript, MIT) — a run-length-encoded table for 1970–2100.
        </li>
        <li>
          <a href="https://www.hamropatro.com/calendar" target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
            Hamro Patro
          </a>
          , Nepal&apos;s most widely used calendar site/app — not open source and not used as copied code, but used
          as a live, authoritative reference to adjudicate disagreements between the library sources above. Its own
          data only goes back to BS 2000.
        </li>
      </ul>

      <H2>What was found</H2>
      <P>
        Cross-comparing two of the libraries across the full 1979–2100 range, they agreed on 123 of 126 years
        exactly. That level of agreement looks like strong corroboration — but checking specific months directly
        against Hamro Patro&apos;s live data showed agreement between the libraries did{" "}
        <strong>not reliably predict correctness</strong>: both libraries agreed with each other on BS 2010
        Baisakh having 31 days, and were <em>both wrong</em> in an initial, less careful reading of Hamro Patro
        that misread it as 30 — a rendered-page-text scraping approach that was abandoned in favor of Hamro
        Patro&apos;s underlying structured day-by-day data once the mistake was caught.
      </P>
      <Callout>
        Three independent libraries checked, all three found to contain real errors in specific years. Library
        consensus is not the same thing as correctness.
      </Callout>

      <H2>How the data was actually built</H2>
      <P>
        <strong>BS 2000–2100</strong> (101 years) was fetched directly from Hamro Patro&apos;s internal calendar
        data — the same structured records its calendar pages render from, pairing each Gregorian day with its
        Bikram Sambat date. This was fetched for every year in the range and cross-checked for internal consistency
        (every month resolved to a clean, gap-free day sequence, zero parse errors across 1,212 month-fetches)
        before being used.
      </P>
      <P>
        <strong>BS 1979–1999</strong> (21 years) predates Hamro Patro&apos;s own records, so these years use the
        amitgaru library&apos;s table. As a sanity check, the running total of days across this span was confirmed
        to land exactly on Hamro Patro&apos;s own BS 2000-01-01 anchor date — so the year-boundary dates are
        corroborated even though individual month lengths within this span aren&apos;t independently verified
        against a live source.
      </P>
      <Callout tone="warn">
        <strong>Known limitation:</strong> unlike 2000–2100, the 1979–1999 rows have not been checked against a
        live calendar day-by-day — only cross-validated between two library sources, plus the year-boundary check
        above. Corrections from anyone with access to physical Patro almanacs for this period are welcome.
      </Callout>

      <H2>Reference date</H2>
      <P>The package&apos;s internal anchor:</P>
      <CodeBlock lang="text" code="BS 1979-01-01 = AD 1922-04-13" />
      <P>
        This is <InlineCode>MinBSYear-01-01</InlineCode>, chosen so every supported date has a non-negative offset
        from the reference. It was derived from amitgaru&apos;s documented anchor and cross-checked independently
        against the frontend&apos;s own <InlineCode>bikram-sambat-js</InlineCode> library, which returned the same
        date. The maximum supported date, BS 2100-12-31, corresponds to <strong>AD 2044-04-13</strong>, verified
        directly from Hamro Patro&apos;s data.
      </P>

      <H2>Reproducing this data</H2>
      <P>
        The extraction above is implemented as a small maintainer tool,{" "}
        <a
          href="https://github.com/suprimkhatri77/go-bs/tree/main/tools/calendar-generator"
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-4"
        >
          tools/calendar-generator
        </a>
        , which regenerates <InlineCode>data.go</InlineCode>. It is not part of the library — go-bs itself has no
        runtime dependencies and makes no network calls; only this generator does, and only when a maintainer runs
        it deliberately.
      </P>

      <H2>Contributing a correction</H2>
      <P>
        If you&apos;re changing calendar data, cite a source that&apos;s independently checkable — a live calendar
        or an official publication, not just another library&apos;s table — and see{" "}
        <a
          href="https://github.com/suprimkhatri77/go-bs/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-4"
        >
          CONTRIBUTING.md
        </a>
        .
      </P>
    </>
  );
}
