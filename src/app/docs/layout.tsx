import { DocsSidebar } from "@/components/DocsSidebar";
import { MobileDocsNav } from "@/components/MobileDocsNav";
import { TableOfContents } from "@/components/TableOfContents";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-8 sm:px-6">
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-20">
          <DocsSidebar />
        </div>
      </aside>
      <article className="min-w-0 flex-1 pb-24">
        <MobileDocsNav />
        <div className="prose max-w-3xl">{children}</div>
      </article>
      <aside className="hidden w-48 shrink-0 xl:block">
        <div className="sticky top-20">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
