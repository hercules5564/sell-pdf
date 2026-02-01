import { NextResponse } from "next/server";
import { getPurchasesByEmail } from "@/lib/purchases";
import { getProduct } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email?.trim()) {
    return NextResponse.json(
      { error: "email query is required" },
      { status: 400 }
    );
  }

  const purchases = getPurchasesByEmail(email);
  const items = purchases.map((p) => {
    const product = getProduct(p.productId);
    return {
      purchaseId: p.id,
      productId: p.productId,
      orderId: p.orderId,
      email: p.email,
      amountInr: p.amountInr,
      createdAt: p.createdAt,
      product: product
        ? {
            title: product.title,
            priceInr: product.priceInr,
          }
        : null,
    };
  });

  return NextResponse.json({ purchases: items });
}
