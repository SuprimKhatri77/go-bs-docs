"use client";

import { useEffect, useRef, useState } from "react";
import { bsToAd, formatBsDate, getBsDayOfWeek, type BSDate } from "bikram-sambat-ts";
import {
  NepaliCalendar,
  NepaliDatePicker,
  type CalendarLocale,
  type ChevronProps,
  type DayButtonProps,
  type DayShape,
  type Numerals,
} from "bikram-sambat-react";
import "bikram-sambat-react/styles.css";
import pkg from "bikram-sambat-react/package.json";

/**
 * Live demos for the React docs. Every one renders the published
 * bikram-sambat-react package (installed as a dependency), the same code a
 * user would install, not a reimplementation. The code shown next to each
 * demo on the page is what it runs, apart from this demo frame and a few
 * layout classes.
 */
export function ReactDemo({ id }: { id: DemoId }) {
  const Demo = DEMOS[id];
  return <Demo />;
}

type DemoId = keyof typeof DEMOS;

const DEMOS = {
  calendar: CalendarDemo,
  "date-picker": DatePickerDemo,
  "icon-position": IconPositionDemo,
  "min-max": MinMaxDemo,
  gregorian: GregorianDemo,
  locale: LocaleDemo,
  shapes: ShapesDemo,
  tailwind: TailwindDemo,
  "day-button": DayButtonDemo,
  "custom-picker": CustomPickerDemo,
};

function Frame({ children, output }: { children: React.ReactNode; output?: React.ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-visible rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border-soft px-4 py-2 text-xs text-muted">
        <span className="font-medium uppercase tracking-wide">Live demo</span>
        <span className="font-mono">bikram-sambat-react@{pkg.version}</span>
      </div>
      <div className="flex flex-wrap items-start gap-6 p-5">{children}</div>
      {output !== undefined && (
        <div className="border-t border-border-soft px-4 py-2.5 font-mono text-xs text-muted">{output}</div>
      )}
    </div>
  );
}

function show(date: BSDate | undefined): string {
  return date ? `{ year: ${date.year}, month: ${date.month}, day: ${date.day} }` : "undefined";
}

const fieldLabel = "mb-1.5 block text-xs font-medium text-muted";

function CalendarDemo() {
  const [date, setDate] = useState<BSDate | undefined>({ year: 2083, month: 6, day: 15 });
  return (
    <Frame
      output={
        date ? (
          <>
            value = {show(date)}
            <br />
            {formatBsDate(date, "dddd, D MMMM YYYY")} · {bsToAd(date).toDateString()}
          </>
        ) : (
          "value = undefined"
        )
      }
    >
      <NepaliCalendar value={date} onChange={setDate} />
    </Frame>
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState<BSDate>();
  return (
    <Frame output={<>value = {show(date)}</>}>
      <div>
        <label htmlFor="demo-dob" className={fieldLabel}>
          Date of birth
        </label>
        <NepaliDatePicker id="demo-dob" value={date} onChange={setDate} clearable />
      </div>
    </Frame>
  );
}

function IconPositionDemo() {
  return (
    <Frame>
      {(["end", "start", "none"] as const).map((position) => (
        <div key={position}>
          <label htmlFor={`demo-icon-${position}`} className={fieldLabel}>
            iconPosition=&quot;{position}&quot;
          </label>
          <NepaliDatePicker id={`demo-icon-${position}`} iconPosition={position} />
        </div>
      ))}
    </Frame>
  );
}

function MinMaxDemo() {
  const [date, setDate] = useState<BSDate>();
  return (
    <Frame output={<>value = {show(date)}</>}>
      <NepaliCalendar
        value={date}
        onChange={setDate}
        defaultMonth={{ year: 2083, month: 6 }}
        minDate={{ year: 2083, month: 6, day: 5 }}
        maxDate={{ year: 2083, month: 7, day: 10 }}
        isDateDisabled={(d) => getBsDayOfWeek(d) === 6}
      />
    </Frame>
  );
}

function GregorianDemo() {
  return (
    <Frame>
      <NepaliCalendar showGregorianDate defaultValue={{ year: 2083, month: 6, day: 15 }} />
      <NepaliCalendar showGregorianDate locale="ne" defaultValue={{ year: 2083, month: 6, day: 15 }} />
    </Frame>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1 text-xs">
      <span className="mr-1 text-muted">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          className={
            "rounded-md border px-2 py-1 font-mono transition-colors " +
            (option === value
              ? "border-foreground/40 bg-background text-foreground"
              : "border-border text-muted hover:text-foreground")
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function LocaleDemo() {
  const [locale, setLocale] = useState<CalendarLocale>("ne");
  const [numerals, setNumerals] = useState<Numerals | "default">("default");
  const numeralsProp = numerals === "default" ? undefined : numerals;
  return (
    <Frame>
      <div className="flex w-full flex-wrap gap-4">
        <Segmented label="locale" value={locale} options={["en", "ne"] as const} onChange={setLocale} />
        <Segmented
          label="numerals"
          value={numerals}
          options={["default", "latin", "devanagari"] as const}
          onChange={setNumerals}
        />
      </div>
      <NepaliCalendar locale={locale} numerals={numeralsProp} defaultValue={{ year: 2083, month: 6, day: 15 }} />
      <div>
        <label htmlFor="demo-locale-picker" className={fieldLabel}>
          NepaliDatePicker
        </label>
        <NepaliDatePicker
          id="demo-locale-picker"
          locale={locale}
          numerals={numeralsProp}
          defaultValue={{ year: 2083, month: 6, day: 15 }}
        />
      </div>
    </Frame>
  );
}

function ShapesDemo() {
  const [shape, setShape] = useState<DayShape>("circle");
  return (
    <Frame>
      <div className="w-full">
        <Segmented
          label="dayShape"
          value={shape}
          options={["circle", "rounded", "square"] as const}
          onChange={setShape}
        />
      </div>
      <NepaliCalendar dayShape={shape} defaultValue={{ year: 2083, month: 6, day: 15 }} />
    </Frame>
  );
}

// Custom parts are defined at module level, so they keep their identity
// between renders.
function ArrowChevron({ direction }: ChevronProps) {
  return <span aria-hidden="true">{direction === "previous" ? "←" : "→"}</span>;
}

function TailwindDemo() {
  const [date, setDate] = useState<BSDate | undefined>({ year: 2083, month: 6, day: 15 });
  return (
    <Frame output={<>value = {show(date)}</>}>
      <NepaliCalendar
        unstyled
        value={date}
        onChange={setDate}
        components={{ Chevron: ArrowChevron }}
        classNames={{
          root: "inline-block rounded-2xl border border-border bg-background p-4 shadow-sm",
          header: "mb-3 flex items-center justify-between gap-2",
          nav: "grid size-8 place-items-center rounded-full border border-border text-muted hover:text-foreground disabled:opacity-30",
          selects: "flex gap-1",
          select: "rounded-md bg-transparent px-1 py-1 text-sm font-semibold text-foreground [&>option]:bg-background",
          weekday: "size-10 text-[11px] font-medium uppercase tracking-wide text-faint [&_abbr]:no-underline",
          cell: "p-0.5 text-center",
          day: "size-9 rounded-full text-sm text-foreground tabular-nums outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent [&:not([data-selected])]:hover:bg-surface-hover",
          selected: "bg-accent font-semibold text-accent-foreground",
          today: "underline decoration-2 underline-offset-4 decoration-accent",
          disabled: "text-faint line-through",
        }}
      />
    </Frame>
  );
}

// Example data only: bikram-sambat-react doesn't ship holidays or events.
const EVENTS = new Set(["2083-06-03", "2083-06-11", "2083-06-18", "2083-06-26"]);

function EventDayButton({ date, state, children, ...props }: DayButtonProps) {
  const hasEvent = EVENTS.has(formatBsDate(date));
  return (
    <button type="button" {...props}>
      {children}
      {hasEvent && (
        <span
          aria-hidden="true"
          className={
            "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full " +
            (state.selected ? "bg-current" : "bg-accent")
          }
        />
      )}
    </button>
  );
}

function DayButtonDemo() {
  return (
    <Frame>
      <NepaliCalendar components={{ DayButton: EventDayButton }} defaultValue={{ year: 2083, month: 6, day: 11 }} />
    </Frame>
  );
}

function CustomPickerDemo() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<BSDate>();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <Frame output={<>value = {show(date)}</>}>
      <div ref={rootRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm hover:border-foreground/30"
        >
          {date ? formatBsDate(date, "D MMMM YYYY") : "Pick a date"}
        </button>
        {open && (
          <div
            role="dialog"
            aria-label="Choose a date"
            className="absolute left-0 top-full z-20 mt-2"
            onKeyDown={(event) => event.key === "Escape" && close()}
          >
            <NepaliCalendar
              autoFocus
              value={date}
              onChange={(next) => {
                setDate(next);
                close();
              }}
              className="shadow-lg"
            />
          </div>
        )}
      </div>
    </Frame>
  );
}
