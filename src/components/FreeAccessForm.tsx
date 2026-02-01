"use client";

import { useState } from "react";
import type { PdfProduct } from "@/lib/catalog";

type Props = { product: PdfProduct };

export function FreeAccessForm({ product }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/purchases/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams({
        email: data.email,
        order: data.orderId,
      });
      window.location.href = `/viewer/${product.id}?${params.toString()}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div className="space-y-1.5 text-sm">
        <label className="block text-xs font-semibold text-muted">
          Your email (for viewer access & My Library)
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-xl border-2 border-card-border bg-card px-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          disabled={loading}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-accent/30 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
      >
        {loading ? "Opening viewer…" : "Get free access"}
      </button>
    </form>
  );
}
