"use client";

import { useState, useCallback } from "react";
import type { PdfProduct } from "@/lib/catalog";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  order_id: string;
  name?: string;
  description?: string;
  prefill?: { email?: string };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
};

type RazorpayInstance = { open: () => void };

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (document.querySelector(`script[src="${SCRIPT_URL}"]`))
    return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(s);
  });
}

type Props = { product: PdfProduct };

export function BuyButton({ product }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCheckout = useCallback(
    async (orderId: string, keyId: string, amountPaise: number) => {
      await loadScript();
      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        setError("Payment script failed to load.");
        return;
      }

      const rzp = new Razorpay({
        key: keyId,
        amount: amountPaise,
        order_id: orderId,
        name: "PlacePDF",
        description: product.title,
        prefill: { email: email.trim() || undefined },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(true);
          setError(null);
          try {
            const res = await fetch("/api/purchases/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: product.id,
                email: email.trim(),
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error ?? "Verification failed");
              return;
            }
            const params = new URLSearchParams({
              email: email.trim(),
              order: response.razorpay_order_id,
            });
            window.location.href = `/viewer/${product.id}?${params.toString()}`;
          } catch (e) {
            setError("Something went wrong. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      });
      rzp.open();
    },
    [product.id, product.title, email]
  );

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? data.hint ?? "Could not create order");
        setLoading(false);
        return;
      }
      await openCheckout(data.orderId, data.keyId, data.amount);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="mt-5 space-y-4">
      <div className="space-y-1.5 text-sm">
        <label className="block text-xs font-semibold text-muted">
          Your email (for receipt & viewer access)
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
        {loading ? "Opening payment…" : `Pay ₹${product.priceInr}`}
      </button>
    </form>
  );
}
