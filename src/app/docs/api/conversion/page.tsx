import { DocsHeader, H2, P, ApiEntry, Callout, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Conversion" };

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Conversion"
        description="The two functions this library exists for: converting between Gregorian (AD) and Bikram Sambat (BS)."
      />

      <ApiEntry signature="func ADToBS(t time.Time) (Date, error)">
        <P>
          Converts a Gregorian calendar date to Bikram Sambat. Only the <InlineCode>Year</InlineCode>,{" "}
          <InlineCode>Month</InlineCode> and <InlineCode>Day</InlineCode> components of <InlineCode>t</InlineCode>{" "}
          are used — time-of-day and location are ignored. Returns an error wrapping{" "}
          <InlineCode>ErrOutOfRange</InlineCode> if <InlineCode>t</InlineCode> falls outside the Gregorian range
          corresponding to <InlineCode>MinBSYear..MaxBSYear</InlineCode>.
        </P>
      </ApiEntry>

      <ApiEntry signature="func BSToAD(d Date) (time.Time, error)">
        <P>
          Converts a Bikram Sambat date to the corresponding Gregorian calendar date, returned as a{" "}
          <InlineCode>time.Time</InlineCode> at UTC midnight. Returns an error wrapping{" "}
          <InlineCode>ErrInvalidYear</InlineCode>, <InlineCode>ErrInvalidMonth</InlineCode> or{" "}
          <InlineCode>ErrInvalidDay</InlineCode> if <InlineCode>d</InlineCode> is not a real, supported Bikram Sambat
          date.
        </P>
      </ApiEntry>

      <H2>Example</H2>
      <CodeBlock
        lang="go"
        code={`ad := time.Date(2026, time.September, 22, 0, 0, 0, 0, time.UTC)

d, err := bs.ADToBS(ad)
// d == bs.Date{Year: 2083, Month: 6, Day: 6}, err == nil

back, err := bs.BSToAD(d)
// back == time.Date(2026, 9, 22, 0, 0, 0, 0, time.UTC), err == nil`}
      />

      <H2>Timezone behavior</H2>
      <P>
        <InlineCode>ADToBS</InlineCode> normalizes its input to a UTC-midnight calendar date before converting, so
        the same Gregorian calendar date always converts to the same BS date regardless of which timezone the{" "}
        <InlineCode>time.Time</InlineCode> is expressed in.
      </P>
      <CodeBlock
        lang="go"
        code={`kathmandu, _ := time.LoadLocation("Asia/Kathmandu")
newYork, _ := time.LoadLocation("America/New_York")

t1 := time.Date(2026, 9, 22, 0, 0, 0, 0, kathmandu)
t2 := time.Date(2026, 9, 22, 23, 59, 59, 0, newYork)

d1, _ := bs.ADToBS(t1)
d2, _ := bs.ADToBS(t2)
// d1 == d2 == bs.Date{2083, 6, 6}`}
      />

      <Callout>
        Every one of the 44,562 supported days round-trips exactly in both directions (
        <InlineCode>BS → AD → BS</InlineCode> and <InlineCode>AD → BS → AD</InlineCode>) — this is checked
        exhaustively in the library&apos;s test suite, not sampled.
      </Callout>
    </>
  );
}
