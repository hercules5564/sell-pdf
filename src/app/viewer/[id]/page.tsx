import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ViewerPageClient } from "@/components/ViewerPageClient";
import { getProduct } from "@/lib/catalog";

export default async function ViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product || !product.pdfPublicPath) return notFound();

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const email =
    typeof resolvedSearchParams?.email === "string"
      ? resolvedSearchParams.email
      : undefined;
  const order =
    typeof resolvedSearchParams?.order === "string"
      ? resolvedSearchParams.order
      : undefined;

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="py-8">
        <ViewerPageClient
          productId={product.id}
          pdfUrl={product.pdfPublicPath}
          initialEmail={email}
          initialOrderId={order}
          productTitle={product.title}
        />
      </main>
    </div>
  );
}

