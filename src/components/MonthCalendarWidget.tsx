"use client";

import { useMemo, useState } from "react";
import { useGoBS } from "@/lib/useGoBS";
import type { GoBS } from "@/lib/wasm";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Today's Gregorian date in Nepal (UTC+05:45) as "YYYY-MM-DD", so "today" is
 * highlighted by Nepal's calendar day, the same day TodayBS reports, not by
 * UTC's (which lags Nepal's by a day for 5h45m after Nepal's midnight).
 */
function todayInNepalISO(): string {
  return new Date(Date.now() + (5 * 60 + 45) * 60_000).toISOString().slice(0, 10);
}

/** The Go version: the grid comes from go-bs's MonthCalendar, compiled to WebAssembly. */
export function MonthCalendarWidget() {
  const state = useGoBS();
  return (
    <WidgetFrame>
      {(year, month) => (
        <>
          {state.status === "loading" && <div className="py-10 text-center text-sm text-muted">Loading…</div>}
          {state.status === "error" && <div className="py-10 text-center text-sm text-accent">{state.error}</div>}
          {state.status === "ready" && <GoGrid goBS={state.goBS} year={year} month={month} />}
        </>
      )}
    </WidgetFrame>
  );
}

/** The year/month inputs and card that every language's widget shares. */
export function WidgetFrame({ children }: { children: (year: number, month: number) => React.ReactNode }) {
  const [year, setYear] = useState(2083);
  const [month, setMonth] = useState(6);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <NumberField label="Year" value={year} onChange={setYear} min={1979} max={2100} width="w-24" />
        <NumberField label="Month" value={month} onChange={setMonth} min={1} max={12} width="w-16" />
      </div>
      {children(year, month)}
    </div>
  );
}

function GoGrid({ goBS, year, month }: { goBS: GoBS; year: number; month: number }) {
  const result = useMemo(() => goBS.monthCalendar(year, month), [goBS, year, month]);
  const today = useMemo(() => goBS.adToBS(todayInNepalISO()).value ?? null, [goBS]);

  if (result.error || !result.value) {
    return <div className="py-10 text-center text-sm text-accent">{result.error}</div>;
  }

  const { weeks, monthName, monthNameNepali } = result.value;
  return (
    <MonthGrid
      year={year}
      month={month}
      weeks={weeks}
      monthName={monthName ?? ""}
      monthNameNepali={monthNameNepali}
      today={today}
    />
  );
}

/** The rendered month: a Sunday-first table of day numbers, null for empty cells. */
export function MonthGrid({
  year,
  month,
  weeks,
  monthName,
  monthNameNepali,
  today,
}: {
  year: number;
  month: number;
  weeks: (number | null)[][];
  monthName: string;
  monthNameNepali?: string;
  today: { year: number; month: number; day: number } | null;
}) {
  return (
    <div>
      <div className="mb-3 text-sm font-medium">
        {monthName} {year}
        {monthNameNepali ? <span className="ml-2 text-muted">({monthNameNepali})</span> : null}
      </div>
      <table className="mcw-table w-full table-fixed text-center text-sm">
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} className="pb-2 text-center font-normal text-muted">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                const isToday = day !== null && today?.year === year && today?.month === month && today?.day === day;
                return (
                  <td key={j} className="py-1.5 text-center">
                    {day === null ? (
                      ""
                    ) : (
                      <span
                        className={
                          "inline-flex size-7 items-center justify-center rounded-full font-mono " +
                          (isToday ? "bg-accent font-semibold text-accent-foreground" : "hover:bg-background")
                        }
                      >
                        {day}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WidgetError({ message }: { message: string }) {
  return <div className="py-10 text-center text-sm text-accent">{message}</div>;
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  width,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  width: string;
}) {
  return (
    <label className={width}>
      <span className="sr-only">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
