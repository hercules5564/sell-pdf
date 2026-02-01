import { SiteHeader } from "@/components/SiteHeader";
import { Container } from "@/components/ui";
import { LibraryContent } from "@/components/LibraryContent";

export default function LibraryPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              My Library
            </h1>
            <p className="mt-2 text-sm text-muted">
              Enter the email you used to buy to see your purchased PDFs.
            </p>
          </div>

          <LibraryContent />
        </Container>
      </main>
    </div>
  );
}
