"use client";

import dynamic from "next/dynamic";
import { Container } from "@/components/ui";

const ViewerGate = dynamic(
  () =>
    import("@/components/ViewerGate").then((m) => ({ default: m.ViewerGate })),
  { ssr: false }
);

type Props = {
  productId: string;
  pdfUrl: string;
  initialEmail?: string;
  initialOrderId?: string;
  productTitle: string;
};

export function ViewerPageClient({
  productId,
  pdfUrl,
  initialEmail,
  initialOrderId,
  productTitle,
}: Props) {
  return (
    <Container>
      <div className="mb-6">
        <span className="text-xs font-medium uppercase tracking-wider text-accent">
          Viewer
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {productTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter buyer details to unlock. The viewer will overlay them as a
          watermark on every page.
        </p>
      </div>

      <ViewerGate
        pdfUrl={pdfUrl}
        productId={productId}
        initialEmail={initialEmail}
        initialOrderId={initialOrderId}
      />
    </Container>
  );
}
