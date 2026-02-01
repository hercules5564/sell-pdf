import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProduct } from "@/lib/catalog";
import { addPurchase } from "@/lib/purchases";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      email,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      productId?: string;
      email?: string;
    };

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !productId ||
      !email?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 503 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const purchase = addPurchase({
      productId,
      email: email.trim(),
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amountInr: product.priceInr,
    });

    return NextResponse.json({
      ok: true,
      purchase: {
        id: purchase.id,
        productId: purchase.productId,
        orderId: purchase.orderId,
        email: purchase.email,
      },
    });
  } catch (e) {
    console.error("Verify purchase error:", e);
    return NextResponse.json(
      { error: "Failed to verify purchase" },
      { status: 500 }
    );
  }
}
