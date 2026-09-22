import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

const GITHUB_URL = "https://github.com/suprimkhatri77/go-bs";
const PKG_GO_DEV_URL = "https://pkg.go.dev/github.com/suprimkhatri77/go-bs";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm relative">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden
              className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground"
            >
              बै
            </span>
            go-bs
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted sm:flex">
            <Link href="/docs/getting-started" className="transition-colors hover:text-foreground">
              Docs
            </Link>
            <Link href="/docs/api/conversion" className="transition-colors hover:text-foreground">
              API reference
            </Link>
            <Link href="/docs/data-verification" className="transition-colors hover:text-foreground">
              Calendar data
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={PKG_GO_DEV_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:inline"
          >
            pkg.go.dev
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="go-bs on GitHub"
            className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-foreground hover:border-foreground/30"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.69.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.21.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
            </svg>
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
