// app/api/webhook/route.ts
import { verifyWebhookSignature } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Must use raw body for signature verification
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const { event: eventType, payload } = event;

  try {
    switch (eventType) {
      case "subscription.activated": {
        const sub = payload.subscription.entity;
        await db.subscription.updateMany({
          where: { razorpaySubId: sub.id },
          data: { status: "ACTIVE" },
        });
        break;
      }

      case "subscription.charged": {
        const sub = payload.subscription.entity;
        // Extend period by 1 month
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        await db.subscription.updateMany({
          where: { razorpaySubId: sub.id },
          data: {
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const sub = payload.subscription.entity;
        await db.subscription.updateMany({
          where: { razorpaySubId: sub.id },
          data: {
            status: eventType === "subscription.cancelled" ? "CANCELLED" : "EXPIRED",
          },
        });
        break;
      }

      case "subscription.paused": {
        const sub = payload.subscription.entity;
        await db.subscription.updateMany({
          where: { razorpaySubId: sub.id },
          data: { status: "PAUSED" },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
