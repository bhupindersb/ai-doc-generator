// app/api/subscribe/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLANS, createRazorpayCustomer, createSubscription } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  if (!["SOLO", "TEAM"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planConfig = PLANS[plan as keyof typeof PLANS];

  // Safety check — make sure plan ID env var is set
  if (!planConfig.id) {
    return NextResponse.json(
      { error: `Plan ID not configured for ${plan}. Check RAZORPAY_PLAN_SOLO / RAZORPAY_PLAN_TEAM env vars.` },
      { status: 500 }
    );
  }

  try {
    // Get or create Razorpay customer
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    let customerId = user?.razorpayCustomerId;

    if (!customerId) {
      customerId = await createRazorpayCustomer(
        session.user.name ?? "User",
        session.user.email ?? ""
      );
      await db.user.update({
        where: { id: session.user.id },
        data: { razorpayCustomerId: customerId },
      });
    }

    // Create Razorpay subscription
    const subscription = await createSubscription(planConfig.id, customerId);

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      plan,
      currency: "USD",
    });
  } catch (err: any) {
    // Extract the exact Razorpay error
    const razorpayError =
      err?.error?.description ??
      err?.error?.field ??
      err?.message ??
      "Failed to create subscription";

    console.error("Subscribe error full:", JSON.stringify(err, null, 2));

    return NextResponse.json(
      { error: razorpayError },
      { status: 500 }
    );
  }
}
