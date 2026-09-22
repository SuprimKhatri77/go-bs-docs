import { DocsSidebar } from "@/components/DocsSidebar";
import { MobileDocsNav } from "@/components/MobileDocsNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 sm:px-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-20">
          <DocsSidebar />
        </div>
      </aside>
      <article className="min-w-0 flex-1 pb-20">
        <MobileDocsNav />
        {children}
      </article>
    </div>
  );
}
