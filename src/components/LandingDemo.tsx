"use client";

import { useMemo, useState } from "react";
import { useGoBS } from "@/lib/useGoBS";
import type { GoBS } from "@/lib/wasm";

type Tab = "adbs" | "bsad" | "cal";

const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function LandingDemo() {
  const state = useGoBS();
  const [tab, setTab] = useState<Tab>("adbs");

  return (
    <div className="min-w-0 overflow-hidden rounded-[14px] border border-border bg-surface">
      <div className="flex items-center gap-1 border-b border-border-soft px-3 py-2.5">
        <TabButton active={tab === "adbs"} onClick={() => setTab("adbs")}>
          AD → BS
        </TabButton>
        <TabButton active={tab === "bsad"} onClick={() => setTab("bsad")}>
          BS → AD
        </TabButton>
        <TabButton active={tab === "cal"} onClick={() => setTab("cal")}>
          Calendar
        </TabButton>
        <div className="flex-1" />
        <span className="pr-1 font-mono text-[10.5px] tracking-wider text-faint uppercase">Live demo</span>
      </div>

      {state.status === "loading" && (
        <div className="flex h-64 items-center justify-center text-sm text-muted">Loading go-bs.wasm…</div>
      )}
      {state.status === "error" && (
        <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-accent">
          Failed to load: {state.error}
        </div>
      )}
      {state.status === "ready" && tab === "adbs" && <ADToBSPanel goBS={state.goBS} />}
      {state.status === "ready" && tab === "bsad" && <BSToADPanel goBS={state.goBS} />}
      {state.status === "ready" && tab === "cal" && <CalendarPanel goBS={state.goBS} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "h-[30px] shrink-0 rounded-[7px] border px-3 font-mono text-xs whitespace-nowrap transition-colors " +
        (active
          ? "border-border bg-[var(--code-bg)] text-foreground"
          : "border-transparent text-muted hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10.5px] tracking-wider text-faint uppercase">{children}</div>
  );
}

function ADToBSPanel({ goBS }: { goBS: GoBS }) {
  const [ad, setAD] = useState(todayISO());
  const result = useMemo(() => goBS.adToBS(ad), [goBS, ad]);

  return (
    <div className="p-[22px]">
      <Label>Gregorian date</Label>
      <input
        type="date"
        value={ad}
        onChange={(e) => setAD(e.target.value)}
        className="mt-2.5 h-11 w-full rounded-[9px] border border-border bg-[var(--code-bg)] px-3 font-mono text-sm outline-none focus:border-accent"
      />
      <div className="mt-5 h-px bg-border-soft" />
      <div className="mt-[18px]">
        <Label>Bikram Sambat</Label>
        {result.error ? (
          <ResultError message={result.error} />
        ) : (
          <ResultOk
            primary={result.value?.string ?? "—"}
            meta={
              result.value
                ? [result.value.weekday, result.value.monthName].filter(Boolean).join(", ")
                : ""
            }
          />
        )}
      </div>
    </div>
  );
}

function BSToADPanel({ goBS }: { goBS: GoBS }) {
  const [year, setYear] = useState(2083);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(6);
  const result = useMemo(() => goBS.bsToAD(year, month, day), [goBS, year, month, day]);

  return (
    <div className="p-[22px]">
      <Label>Bikram Sambat (year / month / day)</Label>
      <div className="mt-2.5 grid grid-cols-[1.2fr_1fr_1fr] gap-2">
        <NumberField value={year} onChange={setYear} min={1979} max={2100} />
        <NumberField value={month} onChange={setMonth} min={1} max={12} />
        <NumberField value={day} onChange={setDay} min={1} max={32} />
      </div>
      <div className="mt-5 h-px bg-border-soft" />
      <div className="mt-[18px]">
        <Label>Gregorian date</Label>
        {result.error ? (
          <ResultError message={result.error} />
        ) : (
          <ResultOk primary={result.value ?? "—"} meta="" />
        )}
      </div>
    </div>
  );
}

function ResultOk({ primary, meta }: { primary: string; meta: string }) {
  return (
    <>
      <div className="mt-2 font-mono text-[clamp(28px,3.4vw,36px)] leading-[1.1] tracking-tight">{primary}</div>
      {meta && <div className="mt-1.5 text-sm text-muted">{meta}</div>}
    </>
  );
}

function ResultError({ message }: { message: string }) {
  return <div className="mt-2 text-sm text-accent">{message}</div>;
}

function NumberField({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-11 w-full rounded-[9px] border border-border bg-[var(--code-bg)] px-3 font-mono text-sm outline-none focus:border-accent"
    />
  );
}

function CalendarPanel({ goBS }: { goBS: GoBS }) {
  const [year, setYear] = useState(2083);
  const [month, setMonth] = useState(6);
  const result = useMemo(() => goBS.monthCalendar(year, month), [goBS, year, month]);
  const today = useMemo(() => goBS.adToBS(todayISO()).value, [goBS]);

  function step(delta: number) {
    let y = year;
    let m = month + delta;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setYear(y);
    setMonth(m);
  }

  const days = result.value?.weeks.flat() ?? [];
  const cells: (number | null)[] = [...days];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="px-[22px] pt-[18px] pb-[22px]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[15px] font-semibold tracking-tight">
          {result.value ? `${result.value.monthName} ${year}` : `${year}-${String(month).padStart(2, "0")}`}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous month"
            className="flex size-[30px] items-center justify-center rounded-[7px] border border-border text-muted transition-colors hover:border-muted hover:text-foreground"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next month"
            className="flex size-[30px] items-center justify-center rounded-[7px] border border-border text-muted transition-colors hover:border-muted hover:text-foreground"
          >
            →
          </button>
        </div>
      </div>
      <div className="mt-3.5 grid grid-cols-7 gap-[3px]">
        {WEEKDAYS_SHORT.map((w, i) => (
          <div key={i} className="pb-1.5 text-center font-mono text-[10px] tracking-wider text-faint">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          const isToday = d !== null && today?.year === year && today?.month === month && today?.day === d;
          return (
          <div
            key={i}
            className={
              "flex h-[38px] items-center justify-center rounded-[7px] font-mono text-[13px] " +
              (d === null
                ? ""
                : isToday
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "border border-border-soft text-muted")
            }
          >
            {d ?? ""}
          </div>
          );
        })}
      </div>
      <div className="mt-3.5 font-mono text-[11.5px] text-faint">
        bs.MonthCalendar({year}, {month}) — Sunday-first, nil-padded
      </div>
    </div>
  );
}
