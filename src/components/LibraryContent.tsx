"use client";

import { useState, useEffect } from "react";
import { Button, Card } from "@/components/ui";

type PurchaseItem = {
  purchaseId: string;
  productId: string;
  orderId: string;
  email: string;
  amountInr: number;
  createdAt: string;
  product: { title: string; priceInr: number } | null;
};

export function LibraryContent() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitted.trim()) return;
    setLoading(true);
    setError(null);
    fetch(`/api/purchases?email=${encodeURIComponent(submitted)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPurchases([]);
        } else {
          setPurchases(data.purchases ?? []);
        }
      })
      .catch(() => {
        setError("Failed to load purchases");
        setPurchases([]);
      })
      .finally(() => setLoading(false));
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(email.trim());
  };

  return (
    <div className="mt-6">
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="h-11 min-w-[200px] flex-1 rounded-xl border-2 border-card-border bg-card px-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-accent/30 hover:-translate-y-0.5"
          >
            Load my purchases
          </button>
        </form>
      </Card>

      {loading && (
        <p className="mt-4 text-sm text-muted">Loading…</p>
      )}
      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}
      {!loading && submitted && purchases.length === 0 && !error && (
        <Card>
          <div className="text-base font-bold text-foreground">No purchases yet</div>
          <p className="mt-2 text-sm text-muted">
            No orders found for <strong className="text-foreground">{submitted}</strong>. Buy a PDF from a
            product page to see it here.
          </p>
          <div className="mt-4">
            <Button href="/companies" variant="secondary">
              Browse companies
            </Button>
          </div>
        </Card>
      )}
      {!loading && purchases.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {purchases.map((p) => (
            <Card key={p.purchaseId} hover>
              <div className="text-base font-bold text-foreground">
                {p.product?.title ?? p.productId}
              </div>
              <p className="mt-1 text-xs text-muted">
                Order {p.orderId} · ₹{p.amountInr}
              </p>
              <div className="mt-4">
                <Button
                  href={`/viewer/${p.productId}?email=${encodeURIComponent(p.email)}&order=${encodeURIComponent(p.orderId)}`}
                >
                  Open viewer →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
