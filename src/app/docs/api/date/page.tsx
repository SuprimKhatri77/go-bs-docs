import { DocsHeader, H2, P, ApiEntry, Callout, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Date, parsing & validation" };

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Date, parsing & validation"
        description="The Date type, constructing dates, getting today's date, and validating year/month/day combinations."
      />

      <ApiEntry signature="type Date struct { Year, Month, Day int }">
        <P>
          A Bikram Sambat calendar date. <InlineCode>Month</InlineCode> is 1-based — 1 is Baisakh, 12 is Chaitra. A{" "}
          <InlineCode>Date</InlineCode> zero value or one built directly from a struct literal isn&apos;t guaranteed
          valid unless constructed with <InlineCode>NewDate</InlineCode> or returned by this package.
        </P>
      </ApiEntry>

      <ApiEntry signature="func NewDate(year, month, day int) (Date, error)">
        <P>
          Constructs and validates a <InlineCode>Date</InlineCode>. Returns an error wrapping{" "}
          <InlineCode>ErrInvalidYear</InlineCode>, <InlineCode>ErrInvalidMonth</InlineCode> or{" "}
          <InlineCode>ErrInvalidDay</InlineCode> if the components don&apos;t form a real Bikram Sambat calendar date
          in the supported range.
        </P>
      </ApiEntry>

      <ApiEntry signature="func Parse(s string) (Date, error)">
        <P>
          Parses a date in <InlineCode>&quot;YYYY-MM-DD&quot;</InlineCode> format — the same format{" "}
          <InlineCode>Date.String</InlineCode> produces. Returns an error wrapping{" "}
          <InlineCode>ErrInvalidFormat</InlineCode> if <InlineCode>s</InlineCode> isn&apos;t shaped like a date, or
          the usual validation errors if it&apos;s shaped correctly but not a real date.
        </P>
      </ApiEntry>

      <ApiEntry signature="func MustParse(s string) Date">
        <P>
          Like <InlineCode>Parse</InlineCode>, but panics instead of returning an error. Meant for cases like
          package-level variable initialization with a literal, known-good date string — most callers should use{" "}
          <InlineCode>Parse</InlineCode>.
        </P>
      </ApiEntry>

      <ApiEntry signature="func TodayBS() (Date, error)">
        <P>
          Returns the current system date converted to Bikram Sambat. Returns an error wrapping{" "}
          <InlineCode>ErrOutOfRange</InlineCode> if today&apos;s date falls outside the supported range — i.e. this
          code running before <InlineCode>MinBSYear</InlineCode> or after <InlineCode>MaxBSYear</InlineCode>&apos;s
          corresponding Gregorian date.
        </P>
      </ApiEntry>

      <ApiEntry signature="func (d Date) Valid() bool">
        <P>Reports whether d is a real Bikram Sambat calendar date in the supported range.</P>
      </ApiEntry>

      <ApiEntry signature='func (d Date) String() string // "YYYY-MM-DD"'>
        <P>Formats d as an ISO-like string, zero-padded.</P>
      </ApiEntry>

      <H2>Validation</H2>

      <ApiEntry signature="func IsValid(year, month, day int) bool">
        <P>
          Reports whether year, month and day form a real Bikram Sambat calendar date within the supported range —
          checked against the actual number of days in that month, not just a generic 1–31 shape check.
        </P>
      </ApiEntry>

      <ApiEntry signature="func IsSupportedBSYear(year int) bool">
        <P>
          Reports whether year is within <InlineCode>MinBSYear..MaxBSYear</InlineCode>.
        </P>
      </ApiEntry>

      <ApiEntry signature="func DaysInMonth(year, month int) (int, error)">
        <P>
          Returns the number of days in the given Bikram Sambat month (29, 30, 31 or 32, depending on the year and
          month). Returns an error wrapping <InlineCode>ErrInvalidYear</InlineCode> or{" "}
          <InlineCode>ErrInvalidMonth</InlineCode> if out of range.
        </P>
      </ApiEntry>

      <ApiEntry signature="func DaysInYear(year int) (int, error)">
        <P>
          Returns the total number of days in the given Bikram Sambat year (364–367, depending on the year). Returns
          an error wrapping <InlineCode>ErrInvalidYear</InlineCode> if out of range.
        </P>
      </ApiEntry>

      <H2>Example</H2>
      <CodeBlock
        lang="go"
        code={`d, err := bs.NewDate(2083, 6, 6)

d2, err := bs.Parse("2083-06-06")
// d == d2

birthday := bs.MustParse("2060-06-15") // panics if malformed — use a literal only

today, err := bs.TodayBS()

fmt.Println(d.String()) // "2083-06-06"
fmt.Println(d.Valid())  // true

bs.IsValid(2083, 9, 32)      // false — Poush 2083 only has 30 days
bs.IsSupportedBSYear(2101)   // false — outside MinBSYear..MaxBSYear

days, _ := bs.DaysInMonth(2083, 6) // 31
total, _ := bs.DaysInYear(2083)    // 365`}
      />

      <Callout tone="warn">
        <InlineCode>MustParse</InlineCode> panics on invalid input — only use it with a compile-time-known literal
        string, never with user input or anything from an external source. Use <InlineCode>Parse</InlineCode> for
        that.
      </Callout>
    </>
  );
}
