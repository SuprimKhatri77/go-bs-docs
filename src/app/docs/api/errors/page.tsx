import { DocsHeader, H2, P, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Errors" };

const ERRORS: [string, string][] = [
  ["ErrInvalidYear", "A BS year is outside MinBSYear..MaxBSYear."],
  ["ErrInvalidMonth", "A BS month is not in the range 1..12."],
  [
    "ErrInvalidDay",
    "A BS day is not a valid day of the given month — either out of the generic 1..32 bound, or greater than the actual number of days in that month/year.",
  ],
  ["ErrOutOfRange", "An AD date falls outside the Gregorian range corresponding to MinBSYear..MaxBSYear."],
  ["ErrInvalidFormat", 'A string passed to Parse is not shaped like "YYYY-MM-DD".'],
  ["ErrInvalidDateOrder", "Age's birthBS is after its todayBS."],
];

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Errors"
        description="go-bs returns errors, not panics (except MustParse, which documents that it panics). Every error wraps one of these sentinels."
      />

      <div className="mb-8 divide-y divide-border rounded-lg border border-border">
        {ERRORS.map(([name, desc]) => (
          <div key={name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <code className="shrink-0 font-mono text-sm text-accent">{name}</code>
            <span className="text-sm text-muted">{desc}</span>
          </div>
        ))}
      </div>

      <H2>Checking for a specific error</H2>
      <P>
        Every returned error wraps one of the sentinels above via <InlineCode>fmt.Errorf</InlineCode>&apos;s{" "}
        <InlineCode>%w</InlineCode> verb, so use <InlineCode>errors.Is</InlineCode> rather than comparing strings or
        equality directly.
      </P>
      <CodeBlock
        lang="go"
        code={`_, err := bs.NewDate(2080, 1, 32)
if errors.Is(err, bs.ErrInvalidDay) {
	// handle specifically
}`}
      />
    </>
  );
}
