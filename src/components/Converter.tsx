"use client";

import { useMemo, useState } from "react";
import { useGoBS } from "@/lib/useGoBS";
import type { BSDate, GoBS } from "@/lib/wasm";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function Converter() {
  const state = useGoBS();
  const [direction, setDirection] = useState<"adToBS" | "bsToAD">("adToBS");

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-background p-1 text-sm">
          <button
            type="button"
            onClick={() => setDirection("adToBS")}
            className={
              "rounded-md px-3 py-1.5 transition-colors " +
              (direction === "adToBS" ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground")
            }
          >
            AD → BS
          </button>
          <button
            type="button"
            onClick={() => setDirection("bsToAD")}
            className={
              "rounded-md px-3 py-1.5 transition-colors " +
              (direction === "bsToAD" ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground")
            }
          >
            BS → AD
          </button>
        </div>
        <span className="hidden text-xs text-muted sm:inline">
          Running the real go-bs library, compiled to WebAssembly
        </span>
      </div>

      {state.status === "loading" && (
        <div className="flex h-40 items-center justify-center text-sm text-muted">Loading go-bs.wasm…</div>
      )}
      {state.status === "error" && (
        <div className="flex h-40 items-center justify-center text-sm text-accent">
          Failed to load: {state.error}
        </div>
      )}
      {state.status === "ready" &&
        (direction === "adToBS" ? <ADToBSPanel goBS={state.goBS} /> : <BSToADPanel goBS={state.goBS} />)}
    </div>
  );
}

function ADToBSPanel({ goBS }: { goBS: GoBS }) {
  const [ad, setAD] = useState(todayISO());
  const result = useMemo(() => goBS.adToBS(ad), [goBS, ad]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Gregorian date</span>
        <input
          type="date"
          value={ad}
          onChange={(e) => setAD(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent"
        />
      </label>
      <div>
        <span className="mb-1.5 block text-sm text-muted">Bikram Sambat</span>
        {result.error ? (
          <ErrorBox message={result.error} />
        ) : (
          <ResultBox date={result.value} />
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
    <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
      <div>
        <span className="mb-1.5 block text-sm text-muted">Bikram Sambat date</span>
        <div className="flex gap-2">
          <NumberField label="Year" value={year} onChange={setYear} min={1979} max={2100} width="w-24" />
          <NumberField label="Month" value={month} onChange={setMonth} min={1} max={12} width="w-16" />
          <NumberField label="Day" value={day} onChange={setDay} min={1} max={32} width="w-16" />
        </div>
      </div>
      <div>
        <span className="mb-1.5 block text-sm text-muted">Gregorian date</span>
        {result.error ? (
          <ErrorBox message={result.error} />
        ) : (
          <div className="flex h-[70px] items-center rounded-md border border-border bg-background px-4 font-mono text-lg">
            {result.value}
          </div>
        )}
      </div>
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
        className="w-full rounded-md border border-border bg-background px-2 py-2 font-mono text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function ResultBox({ date }: { date: BSDate | null }) {
  if (!date) return null;
  return (
    <div className="rounded-md border border-border bg-background px-4 py-3">
      <div className="font-mono text-lg">{date.string}</div>
      <div className="mt-1 text-sm text-muted">
        {date.weekday}
        {date.monthName ? `, ${date.monthName}` : ""}
        {date.monthNameNepali ? ` (${date.monthNameNepali})` : ""}
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex h-[70px] items-center rounded-md border border-accent/30 bg-accent/5 px-4 text-sm text-accent">
      {message}
    </div>
  );
}
