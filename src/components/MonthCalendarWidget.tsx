"use client";

import { useMemo, useState } from "react";
import { useGoBS } from "@/lib/useGoBS";
import type { GoBS } from "@/lib/wasm";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function MonthCalendarWidget() {
  const state = useGoBS();
  const [year, setYear] = useState(2083);
  const [month, setMonth] = useState(6);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <NumberField label="Year" value={year} onChange={setYear} min={1979} max={2100} width="w-24" />
        <NumberField label="Month" value={month} onChange={setMonth} min={1} max={12} width="w-16" />
      </div>
      {state.status === "loading" && <div className="py-10 text-center text-sm text-muted">Loading…</div>}
      {state.status === "error" && <div className="py-10 text-center text-sm text-accent">{state.error}</div>}
      {state.status === "ready" && <Grid goBS={state.goBS} year={year} month={month} />}
    </div>
  );
}

function Grid({ goBS, year, month }: { goBS: GoBS; year: number; month: number }) {
  const result = useMemo(() => goBS.monthCalendar(year, month), [goBS, year, month]);

  if (result.error || !result.value) {
    return <div className="py-10 text-center text-sm text-accent">{result.error}</div>;
  }

  const { weeks, monthName, monthNameNepali } = result.value;

  return (
    <div>
      <div className="mb-3 text-sm font-medium">
        {monthName} {year}
        {monthNameNepali ? <span className="ml-2 text-muted">({monthNameNepali})</span> : null}
      </div>
      <table className="w-full table-fixed text-center text-sm">
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} className="pb-2 font-normal text-muted">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} className="py-1.5">
                  {day === null ? "" : <span className="inline-flex size-7 items-center justify-center rounded-full font-mono hover:bg-background">{day}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
