import { SiteHeader } from "@/components/SiteHeader";
import { Card, Container } from "@/components/ui";

export default function HowItWorksPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="py-10">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How it works
            </h1>
            <p className="mt-2 text-sm text-muted">
              Pick a company, buy the question pack, and read your PDFs in a
              simple online viewer. Your access is linked to your purchase.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Card hover>
              <div className="text-base font-bold text-accent">Pick a company</div>
              <p className="mt-2 text-sm text-muted">
                Browse by company (Amazon, Google, Microsoft, etc.) and choose
                the question pack that matches your target.
              </p>
            </Card>
            <Card hover>
              <div className="text-base font-bold text-accent">Get instant access</div>
              <p className="mt-2 text-sm text-muted">
                After payment you get immediate access. Open the viewer from My
                Library or the product page and start practicing.
              </p>
            </Card>
            <Card hover>
              <div className="text-base font-bold text-accent">Read online</div>
              <p className="mt-2 text-sm text-muted">
                PDFs open in a secure reader in your browser. No need to
                download — just read and practice from any device.
              </p>
            </Card>
            <Card hover>
              <div className="text-base font-bold text-accent">Your copy, your access</div>
              <p className="mt-2 text-sm text-muted">
                Each purchase is tied to your email. Use My Library to see all
                your packs and open the viewer anytime.
              </p>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

