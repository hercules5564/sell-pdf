import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Button, Card, Container } from "@/components/ui";
import { BuyButton } from "@/components/BuyButton";
import { FreeAccessForm } from "@/components/FreeAccessForm";
import { getProduct } from "@/lib/catalog";

export default async function PdfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return notFound();

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                PDF
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {product.title}
              </h1>
              <p className="mt-3 text-sm text-muted">
                {product.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-card-border bg-muted-bg px-3 py-1.5 text-xs font-medium text-muted">
                  {product.pages} pages
                </span>
                <span className="rounded-full border border-card-border bg-muted-bg px-3 py-1.5 text-xs font-medium text-muted">
                  Updated {product.updatedAt}
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                  Watermark: buyer id + order id
                </span>
                <span className="rounded-full border border-card-border bg-muted-bg px-3 py-1.5 text-xs font-medium text-muted">
                  View-only reader
                </span>
              </div>
            </div>

            <Card className="border-accent/20 shadow-lg shadow-accent/5">
              {product.priceInr === 0 ? (
                <>
                  <div className="text-sm font-bold uppercase tracking-wider text-accent">
                    Free
                  </div>
                  <div className="mt-2 text-3xl font-bold text-foreground">
                    Free access
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Enter your email to get instant access. No payment required.
                  </p>

                  <FreeAccessForm product={product} />

                  <div className="mt-5 grid gap-2">
                    <Button href={`/viewer/${product.id}`} variant="secondary">
                      Already have access? Open viewer
                    </Button>
                    <Button href="/library" variant="ghost">
                      Go to My Library
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold uppercase tracking-wider text-accent">
                    Buy access
                  </div>
                  <div className="mt-2 text-4xl font-bold text-foreground">
                    ₹{product.priceInr}
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Pay with Razorpay. After payment you’ll get instant access to the
                    watermarked viewer.
                  </p>

                  <BuyButton product={product} />

                  <div className="mt-5 grid gap-2">
                    <Button href={`/viewer/${product.id}`} variant="secondary">
                      Already bought? Open viewer
                    </Button>
                    <Button href="/library" variant="ghost">
                      Go to My Library
                    </Button>
                  </div>
                </>
              )}

              <div className="mt-5 rounded-xl border border-card-border bg-muted-bg p-4 text-xs text-muted">
                The viewer disables download/print UI and overlays a watermark
                (your email + order id). Screenshots are still possible.
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

