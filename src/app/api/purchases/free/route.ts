import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
import { addPurchase } from "@/lib/purchases";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, email } = body as { productId?: string; email?: string };

    if (!productId?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "productId and email are required" },
        { status: 400 }
      );
    }

    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.priceInr !== 0) {
      return NextResponse.json(
        { error: "This product is not free" },
        { status: 400 }
      );
    }

    const orderId = `FREE-${productId}-${Date.now()}`;
    addPurchase({
      productId: product.id,
      email: email.trim(),
      orderId,
      paymentId: "free",
      amountInr: 0,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      email: email.trim(),
    });
  } catch (e) {
    console.error("Free purchase error:", e);
    return NextResponse.json(
      { error: "Failed to grant free access" },
      { status: 500 }
    );
  }
}
