import { SiteHeader } from "@/components/SiteHeader";
import { Button, Card, Container } from "@/components/ui";
import { companies } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-card-border bg-gradient-to-b from-accent/5 via-background to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,148,136,0.15),transparent)]" />
          <Container>
            <div className="relative py-16 md:py-24">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
                  Company-wise question packs · Read online
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Placement prep PDFs —{" "}
                  <span className="text-accent">company-specific</span>{" "}
                  questions that help you crack placements.
                </h1>
                <p className="mt-5 text-base text-muted md:text-lg">
                  Get curated question packs by company. Practice with
                  real-style placement questions and read them in a secure
                  online viewer — no downloads, just focus on cracking your
                  dream company.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/companies">Browse companies</Button>
                  <Button href="/how-it-works" variant="secondary">
                    How it works
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-12 md:py-16">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Popular companies
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Click a company to view available PDFs.
                </p>
              </div>
              <Button href="/companies" variant="ghost">
                View all →
              </Button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {companies.slice(0, 3).map((c) => (
                <Card key={c.slug} hover>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        {c.name}
                      </div>
                      <div className="mt-1 text-sm text-muted">
                        {c.tagline}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                      Company
                    </span>
                  </div>
                  <div className="mt-6">
                    <Button href={`/companies/${c.slug}`} variant="secondary">
                      View PDFs →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
