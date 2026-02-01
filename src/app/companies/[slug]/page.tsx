import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Button, Card, Container } from "@/components/ui";
import { getCompany, getProductsForCompany } from "@/lib/catalog";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) return notFound();

  const products = getProductsForCompany(company.slug);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              Company
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {company.name}
            </h1>
            <p className="mt-2 text-sm text-muted">{company.tagline}</p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {products.map((p) => (
              <Card key={p.id} hover>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-bold text-foreground">
                      {p.title}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {p.description}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent">
                    {p.priceInr === 0 ? "Free" : `₹${p.priceInr}`}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{p.pages} pages</span>
                  <span>·</span>
                  <span>Updated {p.updatedAt}</span>
                  <span>·</span>
                  <span>Watermarked viewer</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={`/pdf/${p.id}`}>View details</Button>
                  <Button href={`/viewer/${p.id}`} variant="secondary">
                    Open viewer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}

