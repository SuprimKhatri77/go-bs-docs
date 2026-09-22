import { DocsHeader, H2, P, ApiEntry, Callout, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Formatting & Nepali digits" };

const TOKENS: [string, string][] = [
  ["YYYY", '4-digit year, e.g. "2083"'],
  ["YY", '2-digit year, e.g. "83"'],
  ["MMMM", 'full month name, e.g. "Ashwin"'],
  ["MM", "2-digit month, zero-padded"],
  ["M", "month, no leading zero"],
  ["DD", "2-digit day, zero-padded"],
  ["D", "day, no leading zero"],
  ["dddd", 'full weekday name, e.g. "Thursday"'],
  ["ddd", 'weekday abbreviation, e.g. "Thu"'],
];

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Formatting & Nepali digits"
        description="Custom layout strings, month names, and converting between ASCII and Devanagari digits."
      />

      <ApiEntry signature="func (d Date) Format(layout string) (string, error)">
        <P>
          Renders d according to layout, replacing recognized tokens. Any other character (including punctuation
          and spaces) is copied through unchanged. Returns the usual validation errors if d itself is invalid.
        </P>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-1.5 pr-4 font-medium">Token</th>
              <th className="py-1.5 font-medium">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map(([token, meaning]) => (
              <tr key={token} className="border-b border-border/60 last:border-0">
                <td className="py-1.5 pr-4 font-mono">{token}</td>
                <td className="py-1.5 text-muted">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ApiEntry>

      <CodeBlock
        lang="go"
        code={`d, _ := bs.NewDate(2083, 6, 6)

s1, _ := d.Format("YYYY-MM-DD")           // "2083-06-06"
s2, _ := d.Format("dddd, MMMM D, YYYY")   // "Tuesday, Ashwin 6, 2083"
s3, _ := d.Format("D/M/YY")               // "6/6/83"`}
      />

      <Callout tone="warn">
        There&apos;s no <InlineCode>MMM</InlineCode> (3-letter month abbreviation) token — Nepali month names
        don&apos;t abbreviate unambiguously (Ashadh and Ashwin both start &quot;Ash&quot;). An unsupported{" "}
        <InlineCode>MMM</InlineCode> in a layout currently decomposes into <InlineCode>MM</InlineCode> +{" "}
        <InlineCode>M</InlineCode> rather than erroring.
      </Callout>

      <H2>Month names</H2>

      <ApiEntry signature="func MonthName(month int) (string, error)">
        <P>
          The English name of the given 1-based month (1 is Baisakh, 12 is Chaitra). <InlineCode>Date.MonthName()</InlineCode>{" "}
          is the equivalent method.
        </P>
      </ApiEntry>

      <ApiEntry signature="func MonthNameNepali(month int) (string, error)">
        <P>
          The Devanagari name of the given month, e.g. <InlineCode>असोज</InlineCode> for Ashwin.{" "}
          <InlineCode>Date.MonthNameNepali()</InlineCode> is the equivalent method. These were verified against Hamro
          Patro&apos;s own calendar page titles — see{" "}
          <a href="/docs/data-verification" className="text-accent underline underline-offset-4">
            calendar data sources
          </a>
          .
        </P>
      </ApiEntry>

      <CodeBlock lang="go" code={`bs.MonthName(6)       // "Ashwin", nil
bs.MonthNameNepali(6) // "असोज", nil`} />

      <H2>Nepali digits</H2>

      <ApiEntry signature="func ToNepaliDigits(s string) string">
        <P>Replaces every ASCII digit (0-9) in s with its Devanagari equivalent. Other characters pass through unchanged.</P>
      </ApiEntry>

      <ApiEntry signature="func FromNepaliDigits(s string) string">
        <P>The inverse of ToNepaliDigits.</P>
      </ApiEntry>

      <CodeBlock
        lang="go"
        code={`bs.ToNepaliDigits("2083-06-06")     // "२०८३-०६-०६"
bs.FromNepaliDigits("२०८३-०६-०६")   // "2083-06-06"`}
      />
    </>
  );
}
