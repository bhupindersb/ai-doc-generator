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

  try {
    // Get or create Razorpay customer
    let user = await db.user.findUnique({ where: { id: session.user.id } });
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
    });
  } catch (err: any) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
