import { codeToHtml } from "shiki";
import { CodeExamplesClient } from "./CodeExamplesClient";

const EXAMPLES = [
  {
    key: "convert",
    label: "Convert",
    file: "convert.go",
    caption: "AD → BS and back, with real errors.",
    code: `ad := time.Date(2026, time.September, 22, 0, 0, 0, 0, time.UTC)

d, err := bs.ADToBS(ad)
if err != nil {
    log.Fatal(err)
}
fmt.Println(d) // 2083-06-06

back, _ := bs.BSToAD(d)
fmt.Println(back.Format("2006-01-02")) // 2026-09-22`,
  },
  {
    key: "arith",
    label: "Arithmetic",
    file: "arithmetic.go",
    caption: "Add, compare, measure, clamp to month ends.",
    code: `d, _ := bs.NewDate(2083, 6, 15)

next, _ := d.AddDays(10)
fmt.Println(next)           // 2083-06-25
fmt.Println(d.Before(next)) // true

diff, _ := bs.DaysBetween(d, next)
fmt.Println(diff) // 10

start, _ := d.StartOfMonth()
end, _ := d.EndOfMonth()
fmt.Println(start, end) // 2083-06-01 2083-06-31`,
  },
  {
    key: "format",
    label: "Format",
    file: "format.go",
    caption: "Layouts, Nepali names and digits.",
    code: `d, _ := bs.NewDate(2083, 6, 6)

s, _ := d.Format("dddd, MMMM D, YYYY")
fmt.Println(s) // Tuesday, Ashwin 6, 2083

fmt.Println(bs.ToNepaliDigits(d.String())) // २०८३-०६-०६

name, _ := d.MonthNameNepali()
fmt.Println(name) // असोज`,
  },
];

export async function CodeExamples() {
  const examples = await Promise.all(
    EXAMPLES.map(async (ex) => ({
      ...ex,
      html: await codeToHtml(ex.code, {
        lang: "go",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      }),
    })),
  );

  return <CodeExamplesClient examples={examples} />;
}
