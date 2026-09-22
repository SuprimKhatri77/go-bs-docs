import { DocsHeader, H2, P, ApiEntry, InlineCode } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Comparison" };

export default function Page() {
  return (
    <>
      <DocsHeader title="Comparison" description="Ordering and equality for Date values." />

      <ApiEntry signature="func (d Date) Before(other Date) bool">
        <P>
          Reports whether d is chronologically before other. Compares fields directly and does not require either
          date to be valid.
        </P>
      </ApiEntry>

      <ApiEntry signature="func (d Date) After(other Date) bool">
        <P>Reports whether d is chronologically after other. Same validity note as Before.</P>
      </ApiEntry>

      <ApiEntry signature="func (d Date) Equal(other Date) bool">
        <P>Reports whether d and other represent the same calendar date.</P>
      </ApiEntry>

      <ApiEntry signature="func Compare(a, b Date) int">
        <P>
          Compares two dates: <InlineCode>-1</InlineCode> if a is before b, <InlineCode>0</InlineCode> if
          they&apos;re equal, <InlineCode>1</InlineCode> if a is after b. Same field-only comparison as{" "}
          <InlineCode>Before</InlineCode>/<InlineCode>After</InlineCode>.
        </P>
      </ApiEntry>

      <H2>Example</H2>
      <CodeBlock
        lang="go"
        code={`a, _ := bs.NewDate(2083, 6, 6)
b, _ := bs.NewDate(2083, 6, 7)

a.Before(b) // true
b.After(a)  // true
a.Equal(a)  // true

bs.Compare(a, b) // -1
bs.Compare(a, a) // 0`}
      />

      <P>
        Since <InlineCode>Date</InlineCode> is a plain comparable struct, <InlineCode>a == b</InlineCode> also works
        directly (that&apos;s exactly what <InlineCode>Equal</InlineCode> does) — the named methods exist for
        readability and so a <InlineCode>Date</InlineCode> slice can be sorted with{" "}
        <InlineCode>slices.SortFunc</InlineCode> using <InlineCode>Compare</InlineCode>.
      </P>
    </>
  );
}
