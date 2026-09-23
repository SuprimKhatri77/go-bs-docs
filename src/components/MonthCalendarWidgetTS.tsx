"use client";

import { getBsMonthCalendar, getBsMonthName, getBsMonthNameNepali, todayBs } from "bikram-sambat-ts";
import { MonthGrid, WidgetError, WidgetFrame } from "./MonthCalendarWidget";

/**
 * The TypeScript version of the calendar widget: the grid comes from the
 * published bikram-sambat-ts package's getBsMonthCalendar, running in the
 * browser, not from a reimplementation.
 */
export function MonthCalendarWidgetTS() {
  return <WidgetFrame>{(year, month) => <TSGrid year={year} month={month} />}</WidgetFrame>;
}

function TSGrid({ year, month }: { year: number; month: number }) {
  let weeks: (number | null)[][];
  try {
    weeks = getBsMonthCalendar(year, month).map((week) => week.map((cell) => cell?.day ?? null));
  } catch (error) {
    return <WidgetError message={error instanceof Error ? error.message : String(error)} />;
  }
  let today = null;
  try {
    today = todayBs();
  } catch {
    // Outside BS 1979–2100: nothing to highlight.
  }
  return (
    <MonthGrid
      year={year}
      month={month}
      weeks={weeks}
      monthName={getBsMonthName(month)}
      monthNameNepali={getBsMonthNameNepali(month)}
      today={today}
    />
  );
}
