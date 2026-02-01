import { SiteHeader } from "@/components/SiteHeader";
import { Container } from "@/components/ui";
import { CompanySearch } from "@/components/CompanySearch";
import { companies } from "@/lib/catalog";

export default function CompaniesPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Companies
            </h1>
            <p className="mt-2 text-sm text-muted">
              Choose a company to see available placement question PDFs.
            </p>
          </div>

          <div className="mt-6">
            <CompanySearch companies={companies} />
          </div>
        </Container>
      </main>
    </div>
  );
}

