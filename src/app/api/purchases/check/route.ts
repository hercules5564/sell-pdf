import { NextResponse } from "next/server";
import { hasPurchase } from "@/lib/purchases";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const email = searchParams.get("email");
  const orderId = searchParams.get("orderId");

  if (!productId?.trim() || !email?.trim() || !orderId?.trim()) {
    return NextResponse.json(
      { error: "productId, email, and orderId are required" },
      { status: 400 }
    );
  }

  const ok = hasPurchase(productId, email, orderId);
  return NextResponse.json({ ok });
}
