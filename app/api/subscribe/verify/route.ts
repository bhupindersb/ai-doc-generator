import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPaymentSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }
  const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const subscriptionId = typeof body.razorpay_subscription_id === "string" ? body.razorpay_subscription_id : "";
  const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

  if (!paymentId || !subscriptionId || !signature) {
    return NextResponse.json({ error: "Payment verification details are incomplete." }, { status: 400 });
  }

  const subscription = await db.subscription.findUnique({ where: { razorpaySubId: subscriptionId } });
  if (!subscription || subscription.userId !== userId) {
    return NextResponse.json({ error: "This subscription does not belong to your account." }, { status: 403 });
  }

  if (!verifyPaymentSignature(paymentId, subscriptionId, signature)) {
    return NextResponse.json({ error: "The payment signature could not be verified." }, { status: 403 });
  }

  // Checkout signature validation confirms the checkout response. The signed
  // Razorpay subscription webhook remains the source of truth for activation.
  await db.subscription.update({
    where: { razorpaySubId: subscriptionId },
    data: { status: "PENDING" },
  });

  return NextResponse.json({ success: true, status: "pending_activation" });
}
