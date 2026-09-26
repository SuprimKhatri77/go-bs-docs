"use client";

import { useState } from "react";
import { getBsDayOfWeek, type BSDate } from "bikram-sambat-ts";
import {
  NepaliCalendar,
  NepaliDatePicker,
  type CalendarLocale,
  type DayShape,
  type Numerals,
} from "bikram-sambat-react";
import "bikram-sambat-react/styles.css";
import pkg from "bikram-sambat-react/package.json";
import { CopyButton } from "./CopyButton";

/**
 * An interactive playground for bikram-sambat-react: change props and CSS
 * variables, see the published component update live, and copy the code
 * that reproduces it.
 */

type Theme = "light" | "dark";
type Component = "calendar" | "picker";
type IconPosition = "end" | "start" | "none";
type Font = "inherit" | "serif" | "mono";

interface ColorVar {
  name: string;
  label: string;
  light: string;
  dark: string;
}

// The default stylesheet's values (bikram-sambat-react/styles.css).
const COLORS: ColorVar[] = [
  { name: "--nc-primary", label: "Primary", light: "#b91c1c", dark: "#f87171" },
  { name: "--nc-primary-foreground", label: "On primary", light: "#ffffff", dark: "#1c1917" },
  { name: "--nc-background", label: "Background", light: "#ffffff", dark: "#1c1917" },
  { name: "--nc-foreground", label: "Text", light: "#1c1917", dark: "#f5f5f4" },
  { name: "--nc-muted-foreground", label: "Muted text", light: "#78716c", dark: "#a8a29e" },
  { name: "--nc-border", label: "Border", light: "#e7e5e4", dark: "#3a3533" },
  { name: "--nc-hover", label: "Hover", light: "#f5f5f4", dark: "#292524" },
  { name: "--nc-focus", label: "Focus", light: "#2563eb", dark: "#60a5fa" },
  { name: "--nc-disabled", label: "Disabled", light: "#a8a29e", dark: "#6b6461" },
  { name: "--nc-muted", label: "Muted surface", light: "#f5f5f4", dark: "#292524" },
];

const SIZES = [
  { name: "--nc-radius", label: "Corner radius", min: 0, max: 1.5, step: 0.125, value: 0.5 },
  { name: "--nc-cell-size", label: "Cell size", min: 2, max: 3.25, step: 0.125, value: 2.5 },
] as const;

const FONTS: Record<Font, string> = {
  inherit: "inherit",
  serif: 'Georgia, "Times New Roman", serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

interface Settings {
  component: Component;
  locale: CalendarLocale;
  numerals: Numerals | "auto";
  dayShape: DayShape;
  showGregorianDate: boolean;
  fixedWeeks: boolean;
  minDate: BSDate | undefined;
  maxDate: BSDate | undefined;
  disableSaturdays: boolean;
  iconPosition: IconPosition;
  clearable: boolean;
  disabled: boolean;
  readOnly: boolean;
  theme: Theme;
  colors: Record<string, string>;
  sizes: Record<string, number>;
  font: Font;
}

const DEFAULTS: Settings = {
  component: "calendar",
  locale: "en",
  numerals: "auto",
  dayShape: "circle",
  showGregorianDate: false,
  fixedWeeks: true,
  minDate: undefined,
  maxDate: undefined,
  disableSaturdays: false,
  iconPosition: "end",
  clearable: false,
  disabled: false,
  readOnly: false,
  theme: "light",
  colors: {},
  sizes: {},
  font: "inherit",
};

const saturday = (date: BSDate) => getBsDayOfWeek(date) === 6;

function colorValue(settings: Settings, color: ColorVar): string {
  return settings.colors[`${settings.theme}:${color.name}`] ?? color[settings.theme];
}

function sizeValue(settings: Settings, size: (typeof SIZES)[number]): number {
  return settings.sizes[size.name] ?? size.value;
}

/** The variables that differ from the theme's defaults, for the generated CSS. */
function changedVariables(settings: Settings): [string, string][] {
  const out: [string, string][] = [];
  for (const color of COLORS) {
    const value = colorValue(settings, color);
    if (value !== color[settings.theme]) out.push([color.name, value]);
  }
  for (const size of SIZES) {
    const value = sizeValue(settings, size);
    if (value !== size.value) out.push([size.name, `${value}rem`]);
  }
  if (settings.font !== "inherit") out.push(["--nc-font", FONTS[settings.font]]);
  return out;
}

/**
 * The preview's own rule: every variable, for the chosen theme. It's more
 * specific than the stylesheet's `.dark .nc-calendar`, so a light preview
 * stays light on this site's dark theme (and vice versa).
 */
function previewCss(settings: Settings): string {
  const declarations = [
    ...COLORS.map((color) => `${color.name}: ${colorValue(settings, color)};`),
    ...SIZES.map((size) => `${size.name}: ${sizeValue(settings, size)}rem;`),
    `--nc-font: ${FONTS[settings.font]};`,
  ];
  const scope = ".nc-playground-preview.nc-playground-preview";
  return `${scope} .nc-calendar, ${scope} .nc-date-picker { ${declarations.join(" ")} }`;
}

function dateLiteral(date: BSDate): string {
  return `{ year: ${date.year}, month: ${date.month}, day: ${date.day} }`;
}

function generatedTsx(settings: Settings): string {
  const isPicker = settings.component === "picker";
  const name = isPicker ? "NepaliDatePicker" : "NepaliCalendar";
  const props: string[] = [];
  if (isPicker) props.push('aria-label="Date"');
  props.push("value={date}", "onChange={setDate}");
  if (settings.locale !== "en") props.push(`locale="${settings.locale}"`);
  if (settings.numerals !== "auto") props.push(`numerals="${settings.numerals}"`);
  if (settings.dayShape !== "circle") props.push(`dayShape="${settings.dayShape}"`);
  if (settings.showGregorianDate) props.push("showGregorianDate");
  if (!isPicker && !settings.fixedWeeks) props.push("fixedWeeks={false}");
  if (settings.minDate) props.push(`minDate={${dateLiteral(settings.minDate)}}`);
  if (settings.maxDate) props.push(`maxDate={${dateLiteral(settings.maxDate)}}`);
  if (settings.disableSaturdays) props.push("isDateDisabled={(date) => getBsDayOfWeek(date) === 6}");
  if (isPicker) {
    if (settings.iconPosition !== "end") props.push(`iconPosition="${settings.iconPosition}"`);
    if (settings.clearable) props.push("clearable");
    if (settings.disabled) props.push("disabled");
    if (settings.readOnly) props.push("readOnly");
  }

  const imports = [
    'import { useState } from "react";',
    ...(settings.disableSaturdays ? ['import { getBsDayOfWeek } from "bikram-sambat-ts";'] : []),
    `import { ${name}, type BSDate } from "bikram-sambat-react";`,
    'import "bikram-sambat-react/styles.css";',
  ];
  const darkNote =
    settings.theme === "dark"
      ? `
// Dark palette: render inside an element with class="dark" or data-theme="dark"
// (Tailwind's and next-themes' convention). It covers the date picker's popover too.
`
      : "";
  return `${imports.join("\n")}
${darkNote}
export function MyDate() {
  const [date, setDate] = useState<BSDate>();
  return (
    <${name}
${props.map((prop) => `      ${prop}`).join("\n")}
    />
  );
}
`;
}

function generatedCss(settings: Settings): string | undefined {
  const vars = changedVariables(settings);
  if (vars.length === 0) return undefined;
  const selector =
    settings.theme === "dark" ? ".dark .nc-calendar,\n.dark .nc-date-picker" : ".nc-calendar,\n.nc-date-picker";
  return `/* Load after bikram-sambat-react/styles.css */
${selector} {
${vars.map(([name, value]) => `  ${name}: ${value};`).join("\n")}
}
`;
}

// Small form controls, styled with this site's theme.

const controlLabel = "text-xs text-muted";
const selectClass =
  "w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className={controlLabel}>{label}</span>
      <span className="w-32 shrink-0">{children}</span>
    </label>
  );
}

function Select<T extends string>({
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
    <Field label={label}>
      <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className={controlLabel}>{label}</span>
      <input
        type="checkbox"
        className="size-4 accent-[var(--accent)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-2 border-t border-border-soft pt-3 first:border-0 first:pt-0">
      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-faint">{title}</legend>
      {children}
    </fieldset>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="group relative mt-3">
      <div className="rounded-t-lg border border-b-0 border-border bg-surface px-3 py-1.5 font-mono text-[11px] text-muted">
        {title}
      </div>
      <pre className="overflow-x-auto rounded-b-lg border border-border bg-[var(--code-bg)] p-3 font-mono text-[12.5px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
      <CopyButton getText={() => code} />
    </div>
  );
}

export function ReactPlayground() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [date, setDate] = useState<BSDate>();
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const isPicker = settings.component === "picker";
  const numerals = settings.numerals === "auto" ? undefined : settings.numerals;
  const shared = {
    locale: settings.locale,
    numerals,
    dayShape: settings.dayShape,
    showGregorianDate: settings.showGregorianDate,
    minDate: settings.minDate,
    maxDate: settings.maxDate,
    isDateDisabled: settings.disableSaturdays ? saturday : undefined,
  };
  const css = generatedCss(settings);

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border-soft px-4 py-2 text-xs text-muted">
        <span className="font-medium uppercase tracking-wide">Playground</span>
        <span className="font-mono">bikram-sambat-react@{pkg.version}</span>
      </div>

      <div className="grid md:grid-cols-[1fr_16rem]">
        <div
          className={
            "border-b border-border-soft md:border-r md:border-b-0 " +
            (settings.theme === "dark" ? "bg-[#0c0a09]" : "bg-[#fafaf9]")
          }
        >
          <style>{previewCss(settings)}</style>
          {/* Sticky, so the preview stays in view while scrolling the controls. */}
          <div className="md:sticky md:top-16">
            <div
              className={
                "nc-playground-preview flex min-h-[26rem] items-start p-4 " +
                // The picker's popover opens from the field's left edge, so keep it left-aligned.
                (isPicker ? "justify-start" : "justify-center")
              }
            >
              {isPicker ? (
                <NepaliDatePicker
                  {...shared}
                  aria-label="Date"
                  value={date}
                  onChange={setDate}
                  iconPosition={settings.iconPosition}
                  clearable={settings.clearable}
                  disabled={settings.disabled}
                  readOnly={settings.readOnly}
                />
              ) : (
                <NepaliCalendar {...shared} value={date} onChange={setDate} fixedWeeks={settings.fixedWeeks} />
              )}
            </div>
            <div
              className={
                "border-t px-4 py-2 font-mono text-xs " +
                (settings.theme === "dark" ? "border-[#292524] text-[#a8a29e]" : "border-[#e7e5e4] text-[#78716c]")
              }
            >
              value = {date ? dateLiteral(date) : "undefined"}
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <Group title="Component">
            <Select
              label="component"
              value={settings.component}
              options={["calendar", "picker"] as const}
              onChange={(v) => set("component", v)}
            />
          </Group>

          <Group title="Props">
            <Select label="locale" value={settings.locale} options={["en", "ne"] as const} onChange={(v) => set("locale", v)} />
            <Select
              label="numerals"
              value={settings.numerals}
              options={["auto", "latin", "devanagari"] as const}
              onChange={(v) => set("numerals", v)}
            />
            <Select
              label="dayShape"
              value={settings.dayShape}
              options={["circle", "rounded", "square"] as const}
              onChange={(v) => set("dayShape", v)}
            />
            <Toggle label="showGregorianDate" checked={settings.showGregorianDate} onChange={(v) => set("showGregorianDate", v)} />
            {!isPicker && (
              <Toggle label="fixedWeeks" checked={settings.fixedWeeks} onChange={(v) => set("fixedWeeks", v)} />
            )}
            <Toggle label="disable Saturdays" checked={settings.disableSaturdays} onChange={(v) => set("disableSaturdays", v)} />
            <div className="space-y-1.5">
              <span className={controlLabel}>minDate / maxDate</span>
              <div className="grid gap-2">
                <NepaliDatePicker
                  aria-label="minDate"
                  placeholder="minDate"
                  iconPosition="none"
                  clearable
                  value={settings.minDate}
                  onChange={(v) => set("minDate", v)}
                  className="w-full"
                />
                <NepaliDatePicker
                  aria-label="maxDate"
                  placeholder="maxDate"
                  iconPosition="none"
                  clearable
                  value={settings.maxDate}
                  onChange={(v) => set("maxDate", v)}
                  className="w-full"
                />
              </div>
            </div>
            {isPicker && (
              <>
                <Select
                  label="iconPosition"
                  value={settings.iconPosition}
                  options={["end", "start", "none"] as const}
                  onChange={(v) => set("iconPosition", v)}
                />
                <Toggle label="clearable" checked={settings.clearable} onChange={(v) => set("clearable", v)} />
                <Toggle label="disabled" checked={settings.disabled} onChange={(v) => set("disabled", v)} />
                <Toggle label="readOnly" checked={settings.readOnly} onChange={(v) => set("readOnly", v)} />
              </>
            )}
          </Group>

          <Group title="Style">
            <Select label="theme" value={settings.theme} options={["light", "dark"] as const} onChange={(v) => set("theme", v)} />
            {COLORS.map((color) => (
              <label key={color.name} className="flex items-center justify-between gap-3">
                <span className={controlLabel}>{color.label}</span>
                <span className="flex items-center gap-2">
                  <code className="font-mono text-[10px] text-faint">{colorValue(settings, color)}</code>
                  <input
                    type="color"
                    aria-label={`${color.label} (${color.name})`}
                    className="h-6 w-8 cursor-pointer rounded border border-border bg-transparent"
                    value={colorValue(settings, color)}
                    onChange={(e) =>
                      set("colors", { ...settings.colors, [`${settings.theme}:${color.name}`]: e.target.value })
                    }
                  />
                </span>
              </label>
            ))}
            {SIZES.map((size) => (
              <label key={size.name} className="block space-y-1">
                <span className="flex justify-between">
                  <span className={controlLabel}>{size.label}</span>
                  <code className="font-mono text-[10px] text-faint">{sizeValue(settings, size)}rem</code>
                </span>
                <input
                  type="range"
                  className="w-full accent-[var(--accent)]"
                  min={size.min}
                  max={size.max}
                  step={size.step}
                  value={sizeValue(settings, size)}
                  onChange={(e) => set("sizes", { ...settings.sizes, [size.name]: Number(e.target.value) })}
                />
              </label>
            ))}
            <Select label="font" value={settings.font} options={["inherit", "serif", "mono"] as const} onChange={(v) => set("font", v)} />
          </Group>

          <button
            type="button"
            onClick={() => {
              setSettings(DEFAULTS);
              setDate(undefined);
            }}
            className="w-full rounded-md border border-border px-2 py-1.5 text-xs text-muted hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="border-t border-border-soft p-4 pt-1">
        <CodeBlock title={isPicker ? "DatePicker.tsx" : "Calendar.tsx"} code={generatedTsx(settings)} />
        {css && <CodeBlock title="styles.css" code={css} />}
      </div>
    </div>
  );
}
