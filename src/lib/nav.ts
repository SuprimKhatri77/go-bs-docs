// Imported by next.config.ts, so this file must only use relative imports.
import { DEFAULT_LANGUAGE, LANGUAGES, docsHref, getLanguage, languageFromPath, slugFromPath } from "./languages";
import type { Language, LanguageId } from "./languages";

export interface NavItem {
  title: string;
  /** The page's path without the /docs/<language> prefix, e.g. "api/conversion". */
  slug: string;
  href: string;
  description: string;
  language: LanguageId;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

type SectionDef = { title: string; items: Omit<NavItem, "href" | "language">[] };

// Pages that exist in several languages share a slug, which is how the
// language switcher finds a page's counterpart.
const NAV: Record<LanguageId, SectionDef[]> = {
  go: [
    {
      title: "Introduction",
      items: [
        {
          title: "Getting started",
          slug: "getting-started",
          description: "Install go-bs and make your first conversion.",
        },
      ],
    },
    {
      title: "API reference",
      items: [
        { title: "Conversion", slug: "api/conversion", description: "ADToBS, BSToAD." },
        {
          title: "Date, parsing & validation",
          slug: "api/date",
          description:
            "Date, NewDate, Parse, MustParse, TodayBS, String, Valid, IsValid, IsSupportedBSYear, DaysInMonth, DaysInYear.",
        },
        { title: "Comparison", slug: "api/comparison", description: "Before, After, Equal, Compare." },
        {
          title: "Arithmetic & ranges",
          slug: "api/arithmetic",
          description:
            "AddDays, SubDays, NextDay, PreviousDay, NextMonth, PreviousMonth, DaysBetween, StartOfMonth, EndOfMonth, StartOfYear, EndOfYear, DayOfYear, DayOfWeek, Age.",
        },
        {
          title: "Formatting & Nepali",
          slug: "api/formatting",
          description:
            "Format, FormatNepali, MonthName, MonthNameNepali, WeekdayNameNepali, ToNepaliDigits, FromNepaliDigits.",
        },
        {
          title: "Calendar-grid helpers",
          slug: "api/calendar-grid",
          description: "MonthCalendar, WeeksInMonth, FirstWeekdayOfMonth.",
        },
        {
          title: "JSON & database/sql",
          slug: "api/encoding",
          description: "MarshalText, UnmarshalText, Value, Scan.",
        },
        { title: "Errors", slug: "api/errors", description: "Sentinel errors and errors.Is." },
      ],
    },
    {
      title: "Calendar data",
      items: [
        {
          title: "Sources & verification",
          slug: "data-verification",
          description: "Where the calendar data comes from and how it was checked.",
        },
      ],
    },
  ],
  ts: [
    {
      title: "Introduction",
      items: [
        {
          title: "Getting started",
          slug: "getting-started",
          description: "Install bikram-sambat-ts and make your first conversion.",
        },
      ],
    },
    {
      title: "API reference",
      items: [
        { title: "Conversion", slug: "api/conversion", description: "adToBs, bsToAd, todayBs, and timezones." },
        {
          title: "Dates, parsing & validation",
          slug: "api/date",
          description:
            "BSDate, MIN_BS_YEAR, MAX_BS_YEAR, parseBsDate, isValidBsDate, isSupportedBsYear, daysInBsMonth, daysInBsYear.",
        },
        {
          title: "Comparison",
          slug: "api/comparison",
          description: "compareBsDates, isBeforeBs, isAfterBs, isEqualBs.",
        },
        {
          title: "Arithmetic & ranges",
          slug: "api/arithmetic",
          description:
            "addBsDays, subtractBsDays, daysBetweenBs, getBsDayOfWeek, nextBsMonth, previousBsMonth, startOfBsMonth, endOfBsMonth, startOfBsYear, endOfBsYear, getBsDayOfYear, getBsAge.",
        },
        {
          title: "Formatting & Nepali",
          slug: "api/formatting",
          description:
            "formatBsDate (with nepali: true), getBsMonthName, getBsMonthNameNepali, getBsWeekdayName, getBsWeekdayNameNepali, toNepaliDigits, fromNepaliDigits.",
        },
        {
          title: "Calendar-grid helpers",
          slug: "api/calendar-grid",
          description: "getBsMonthCalendar, weeksInBsMonth, firstWeekdayOfBsMonth.",
        },
        {
          title: "Errors",
          slug: "api/errors",
          description: "InvalidBSDateError, DateOutOfRangeError, BSDateFormatError, InvalidDateOrderError.",
        },
      ],
    },
    {
      title: "Calendar data",
      items: [
        {
          title: "Sources & verification",
          slug: "data-verification",
          description: "Where the calendar data comes from, and how it's kept identical to go-bs.",
        },
      ],
    },
  ],
  react: [
    {
      title: "Introduction",
      items: [
        {
          title: "Getting started",
          slug: "getting-started",
          description: "Install bikram-sambat-react and render your first Bikram Sambat calendar and date picker.",
        },
      ],
    },
    {
      title: "API reference",
      items: [
        {
          title: "NepaliCalendar",
          slug: "api/calendar",
          description:
            "The month calendar: value, defaultValue, onChange, month, minDate, maxDate, isDateDisabled, today, showGregorianDate, dayShape, fixedWeeks, renderDay.",
        },
        {
          title: "NepaliDatePicker",
          slug: "api/date-picker",
          description:
            "Text input with a calendar popover: typed input, iconPosition, clearable, forms (name), disabled, readOnly.",
        },
        {
          title: "Types",
          slug: "api/types",
          description:
            "BSDate, BSMonth, CalendarLocale, Numerals, DayShape, DayState, class-name maps and component prop types.",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Styling & customization",
          slug: "guides/styling",
          description: "CSS variables, dark mode, classNames, Tailwind, unstyled mode and replaceable parts.",
        },
        {
          title: "Localization",
          slug: "guides/localization",
          description: "English or Nepali labels, Latin or Devanagari digits, and Gregorian dates.",
        },
        {
          title: "Accessibility & keyboard",
          slug: "guides/accessibility",
          description: "Keyboard navigation, ARIA roles and labels, focus management and the combobox mode.",
        },
        {
          title: "SSR & Next.js",
          slug: "guides/ssr",
          description: "Server rendering, hydration, today's date, and the Next.js App Router.",
        },
        {
          title: "Building your own picker",
          slug: "guides/custom-picker",
          description: "Compose NepaliCalendar with your own trigger, popover and input.",
        },
      ],
    },
    {
      title: "Calendar data",
      items: [
        {
          title: "Supported range",
          slug: "data-verification",
          description: "Where the calendar data comes from (bikram-sambat-ts) and the supported BS 1979–2100 range.",
        },
      ],
    },
  ],
};

/** The sidebar for a language. */
export function docsNavFor(language: Language): NavSection[] {
  return NAV[language.id].map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({ ...item, href: docsHref(language, item.slug), language: language.id })),
  }));
}

/** Every docs page in every language, in sidebar order, default language first. */
export const allDocsPages: NavItem[] = LANGUAGES.flatMap((language) =>
  docsNavFor(language).flatMap((section) => section.items),
);

export function findDocsPage(href: string): NavItem | undefined {
  return allDocsPages.find((item) => item.href === href);
}

/**
 * Where the language switcher should go from `pathname` to show `target`:
 * the same page in that language if it has one, else its getting-started
 * page.
 */
export function counterpartHref(pathname: string, target: Language): string {
  const slug = slugFromPath(pathname);
  const exists = NAV[target.id].some((section) => section.items.some((item) => item.slug === slug));
  return docsHref(target, exists ? slug : "getting-started");
}

export { DEFAULT_LANGUAGE, getLanguage, languageFromPath };
