export interface NavItem {
  title: string;
  href: string;
  description: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsNav: NavSection[] = [
  {
    title: "Introduction",
    items: [
      {
        title: "Getting started",
        href: "/docs/getting-started",
        description: "Install go-bs and make your first conversion.",
      },
    ],
  },
  {
    title: "API reference",
    items: [
      {
        title: "Conversion",
        href: "/docs/api/conversion",
        description: "ADToBS, BSToAD.",
      },
      {
        title: "Date, parsing & validation",
        href: "/docs/api/date",
        description:
          "Date, NewDate, Parse, MustParse, TodayBS, String, Valid, IsValid, IsSupportedBSYear, DaysInMonth, DaysInYear.",
      },
      {
        title: "Comparison",
        href: "/docs/api/comparison",
        description: "Before, After, Equal, Compare.",
      },
      {
        title: "Arithmetic & ranges",
        href: "/docs/api/arithmetic",
        description:
          "AddDays, SubDays, NextDay, PreviousDay, NextMonth, PreviousMonth, DaysBetween, StartOfMonth, EndOfMonth, StartOfYear, EndOfYear, DayOfYear, DayOfWeek, Age.",
      },
      {
        title: "Formatting & Nepali digits",
        href: "/docs/api/formatting",
        description: "Format, MonthName, MonthNameNepali, ToNepaliDigits, FromNepaliDigits.",
      },
      {
        title: "Calendar-grid helpers",
        href: "/docs/api/calendar-grid",
        description: "MonthCalendar, WeeksInMonth, FirstWeekdayOfMonth.",
      },
      {
        title: "Errors",
        href: "/docs/api/errors",
        description: "Sentinel errors and errors.Is.",
      },
    ],
  },
  {
    title: "Calendar data",
    items: [
      {
        title: "Sources & verification",
        href: "/docs/data-verification",
        description: "Where the calendar data comes from and how it was checked.",
      },
    ],
  },
];

export const flatDocsNav: NavItem[] = docsNav.flatMap((section) => section.items);
