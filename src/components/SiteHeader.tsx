import Link from "next/link";
import { Container } from "@/components/ui";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-background/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md shadow-accent/25">
              <span className="text-lg font-bold">P</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight">PlacePDF</div>
              <div className="text-xs text-muted">
                Question packs for placement prep
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
              href="/companies"
            >
              Companies
            </Link>
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
              href="/how-it-works"
            >
              How it works
            </Link>
            <Link
              className="inline-flex h-9 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/30"
              href="/library"
            >
              My Library
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
