import { DocsHeader, H2, P, ApiEntry, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";
import { MonthCalendarWidget } from "@/components/MonthCalendarWidget";

export const metadata = { title: "Calendar-grid helpers" };

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Calendar-grid helpers"
        description="Building blocks for rendering a month view, like a typical calendar UI."
      />

      <ApiEntry signature="func FirstWeekdayOfMonth(year, month int) (time.Weekday, error)">
        <P>The day of the week that day 1 of the given month falls on.</P>
      </ApiEntry>

      <ApiEntry signature="func WeeksInMonth(year, month int) (int, error)">
        <P>
          The number of calendar-grid rows needed to display the month, with weeks running Sunday through Saturday
          — the same row count <InlineCode>MonthCalendar</InlineCode> returns.
        </P>
      </ApiEntry>

      <ApiEntry signature="func MonthCalendar(year, month int) ([][]*Date, error)">
        <P>
          A week-by-week grid of the month. Each week is exactly 7 cells (Sunday through Saturday); a{" "}
          <InlineCode>nil</InlineCode> cell means no day of this month falls in that slot — padding at the start of
          the first week and/or the end of the last week. Every date from day 1 to the month&apos;s last day appears
          exactly once, in order.
        </P>
      </ApiEntry>

      <CodeBlock
        lang="go"
        code={`weeks, _ := bs.MonthCalendar(2083, 6) // [][]*bs.Date, Sunday-first, nil-padded

for _, week := range weeks {
	for _, day := range week {
		if day == nil {
			fmt.Print("   ")
		} else {
			fmt.Printf("%2d ", day.Day)
		}
	}
	fmt.Println()
}

// Su Mo Tu We Th Fr Sa
//              1  2  3
//  4  5  6  7  8  9 10
// 11 12 13 14 15 16 17
// 18 19 20 21 22 23 24
// 25 26 27 28 29 30 31`}
      />

      <H2>Try it</H2>
      <P>
        This grid is rendered live, in the browser, by calling the actual <InlineCode>MonthCalendar</InlineCode>{" "}
        function (compiled to WebAssembly) — not a JavaScript reimplementation.
      </P>
      <MonthCalendarWidget />
    </>
  );
}
