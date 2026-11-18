// app/api/subscribe/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PLANS, createRazorpayCustomer, createSubscription } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }
  const plan = body.plan;
  if (plan !== "SOLO" && plan !== "TEAM") {
    return NextResponse.json({ error: "Please select a valid paid plan." }, { status: 400 });
  }

  const planConfig = PLANS[plan];
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
  if (!planConfig.id || !keyId || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Payments are not configured yet. Please contact support." }, { status: 503 });
  }

  try {
    const existing = await db.subscription.findUnique({ where: { userId } });
    if (existing?.status === "ACTIVE") {
      return NextResponse.json({ error: "Your account already has an active subscription." }, { status: 409 });
    }
    if (existing?.status === "PENDING" && existing.updatedAt.getTime() > Date.now() - 20 * 60 * 1000) {
      return NextResponse.json({ error: "A checkout is already pending. Please finish it or wait 20 minutes before trying again." }, { status: 409 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user?.email) {
      return NextResponse.json({ error: "A verified email address is required for billing." }, { status: 400 });
    }

    let customerId = user.razorpayCustomerId;
    if (!customerId) {
      customerId = await createRazorpayCustomer(user.name ?? "User", user.email);
      await db.user.update({
        where: { id: userId },
        data: { razorpayCustomerId: customerId },
      });
    }

    const subscription = await createSubscription(planConfig.id, customerId, userId, plan);

    // Persist ownership before returning the checkout details. Webhooks can
    // also arrive before the browser posts the checkout verification payload.
    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        razorpaySubId: subscription.id,
        razorpayPlanId: planConfig.id,
        plan,
        status: "PENDING",
      },
      update: {
        razorpaySubId: subscription.id,
        razorpayPlanId: planConfig.id,
        plan,
        status: "PENDING",
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId,
      plan,
      currency: planConfig.currency,
    });
  } catch (error: any) {
    console.error("Docs AI subscription creation failed:", error?.message ?? error);
    return NextResponse.json(
      { error: "Unable to create your subscription. Please try again or contact support." },
      { status: 502 }
    );
  }
}
