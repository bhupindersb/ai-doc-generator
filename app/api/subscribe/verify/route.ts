// app/api/subscribe/verify/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyPaymentSignature, PLANS } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    plan,
  } = await req.json();

  const isValid = verifyPaymentSignature(
    razorpay_subscription_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const planConfig = PLANS[plan as keyof typeof PLANS];
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Upsert subscription in DB
  await db.subscription.upsert({
    where: { userId: session.user.id },
    update: {
      razorpaySubId: razorpay_subscription_id,
      razorpayPlanId: planConfig.id,
      plan: plan as any,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
    create: {
      userId: session.user.id,
      razorpaySubId: razorpay_subscription_id,
      razorpayPlanId: planConfig.id,
      plan: plan as any,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });

  return NextResponse.json({ success: true });
}
