"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";

const PdfViewer = dynamic(
  () => import("@/components/PdfViewer").then((m) => ({ default: m.PdfViewer })),
  { ssr: false }
);

type Props = {
  pdfUrl: string;
  initialEmail?: string;
  initialOrderId?: string;
  productId: string;
};

export function ViewerGate({
  pdfUrl,
  initialEmail,
  initialOrderId,
  productId,
}: Props) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [orderId, setOrderId] = useState(
    initialOrderId ?? `ORDER-${productId.toUpperCase()}`
  );
  const [unlocked, setUnlocked] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    // Try to restore from localStorage so a student doesn't have to retype
    try {
      const raw = window.localStorage.getItem(`placepdf-${productId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        email?: string;
        orderId?: string;
      };
      if (parsed.email) setEmail(parsed.email);
      if (parsed.orderId) setOrderId(parsed.orderId);
      if (parsed.email && parsed.orderId) setUnlocked(true);
    } catch {
      // ignore
    }
  }, [productId]);

  // If URL has email + order (e.g. after payment redirect), verify purchase and auto-unlock
  useEffect(() => {
    if (!initialEmail?.trim() || !initialOrderId?.trim()) return;
    let cancelled = false;
    fetch(
      `/api/purchases/check?productId=${encodeURIComponent(productId)}&email=${encodeURIComponent(initialEmail)}&orderId=${encodeURIComponent(initialOrderId)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.ok) setUnlocked(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [productId, initialEmail, initialOrderId]);

  const handleUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !orderId.trim()) return;
    setCheckError(null);
    try {
      const res = await fetch(
        `/api/purchases/check?productId=${encodeURIComponent(productId)}&email=${encodeURIComponent(email.trim())}&orderId=${encodeURIComponent(orderId.trim())}`
      );
      const data = await res.json();
      if (data.ok) {
        setUnlocked(true);
        try {
          window.localStorage.setItem(
            `placepdf-${productId}`,
            JSON.stringify({ email: email.trim(), orderId: orderId.trim() })
          );
        } catch {
          // ignore
        }
      } else {
        setCheckError("No purchase found for this email and order. Buy the PDF first or check your details.");
      }
    } catch {
      setCheckError("Could not verify purchase. Check your connection and try again.");
    }
  };

  const watermark = `${email || "student@demo.com"} • ${
    orderId || `ORDER-${productId.toUpperCase()}`
  }`;

  if (!unlocked) {
    return (
      <div className="grid gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card>
          <div className="text-sm font-bold text-accent">Unlock this PDF</div>
          <p className="mt-2 text-xs text-muted">
            Enter the email and order id from your purchase. These values will be
            embedded into the watermark on every page.
          </p>

          {checkError && (
            <p className="mt-3 text-xs font-medium text-red-600">{checkError}</p>
          )}
          <form className="mt-4 space-y-4" onSubmit={handleUnlock}>
            <div className="space-y-1.5 text-sm">
              <label className="block text-xs font-semibold text-muted">
                Student email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="h-11 w-full rounded-xl border-2 border-card-border bg-card px-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="space-y-1.5 text-sm">
              <label className="block text-xs font-semibold text-muted">
                Order id (from payment)
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={orderId || "ORDER-12345"}
                className="h-11 w-full rounded-xl border-2 border-card-border bg-card px-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <Button type="submit" variant="primary">Unlock & open viewer</Button>
          </form>

          <p className="mt-4 text-[11px] text-muted">
            Tip: when you connect real payments, set these from your backend and skip this form.
          </p>
        </Card>

        <Card className="border-accent/20">
          <div className="text-xs font-bold uppercase tracking-wider text-accent">
            Preview watermark text
          </div>
          <div className="mt-3 rounded-xl border border-card-border bg-muted-bg px-4 py-3 text-xs font-mono text-foreground">
            {watermark}
          </div>
          <p className="mt-3 text-[11px] text-muted">
            This text will be tiled diagonally across each page (lower opacity) so screenshots reveal who it was issued to.
          </p>
        </Card>
      </div>
    );
  }

  return <PdfViewer pdfUrl={pdfUrl} watermarkText={watermark} />;
}

