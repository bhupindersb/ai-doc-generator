import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

function dateFromEpoch(value: unknown): Date | undefined {
  const seconds = typeof value === "number" ? value : Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? new Date(seconds * 1000) : undefined;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (typeof event?.event !== "string") {
    return NextResponse.json({ error: "Webhook event type is missing." }, { status: 400 });
  }

  const eventId = request.headers.get("x-razorpay-event-id")
    || crypto.createHash("sha256").update(rawBody).digest("hex");
  const entity = event?.payload?.subscription?.entity;
  if (!entity?.id) {
    // A validly signed event outside the subscription lifecycle is not ours.
    return NextResponse.json({ status: "ignored" });
  }

  const subscriptionId = String(entity.id);
  const userId = String(entity.notes?.userId ?? "");
  const plan = entity.notes?.plan === "TEAM" ? "TEAM" : entity.notes?.plan === "SOLO" ? "SOLO" : null;

  let status: "PENDING" | "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED" = "PENDING";
  switch (event.event) {
    case "subscription.activated":
    case "subscription.charged":
    case "subscription.resumed":
      status = "ACTIVE";
      break;
    case "subscription.paused":
    case "subscription.halted":
      status = "PAUSED";
      break;
    case "subscription.cancelled":
      status = "CANCELLED";
      break;
    case "subscription.completed":
      status = "EXPIRED";
      break;
    default:
      return NextResponse.json({ status: "ignored" });
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.razorpayEvent.create({
        data: { eventId, eventType: event.event },
      });

      let ownerId = userId;
      if (!ownerId) {
        const existing = await tx.subscription.findUnique({ where: { razorpaySubId: subscriptionId } });
        ownerId = existing?.userId ?? "";
      }
      if (!ownerId) {
        throw new Error("Subscription event does not map to an application user.");
      }

      const existing = await tx.subscription.findUnique({ where: { razorpaySubId: subscriptionId } });
      if (existing && existing.userId !== ownerId) {
        throw new Error("Subscription owner does not match the stored subscription.");
      }
      const resolvedPlan = plan ?? existing?.plan;
      if (!resolvedPlan || resolvedPlan === "FREE" || resolvedPlan === "ENTERPRISE") {
        throw new Error("Subscription event has no supported plan mapping.");
      }

      const currentPeriodStart = dateFromEpoch(entity.current_start);
      const currentPeriodEnd = dateFromEpoch(entity.current_end);
      await tx.subscription.upsert({
        where: { razorpaySubId: subscriptionId },
        create: {
          userId: ownerId,
          razorpaySubId: subscriptionId,
          razorpayPlanId: String(entity.plan_id ?? ""),
          plan: resolvedPlan,
          status,
          ...(currentPeriodStart ? { currentPeriodStart } : {}),
          ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
        },
        update: {
          plan: resolvedPlan,
          status,
          ...(entity.plan_id ? { razorpayPlanId: String(entity.plan_id) } : {}),
          ...(currentPeriodStart ? { currentPeriodStart } : {}),
          ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
        },
      });
    });

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    if (error?.code === "P2002") {
      const duplicate = await db.razorpayEvent.findUnique({ where: { eventId } });
      if (duplicate) return NextResponse.json({ status: "duplicate_ignored" });
    }
    console.error("Razorpay webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
