// lib/razorpay.ts
import Razorpay from "razorpay";
import crypto from "crypto";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const PLANS = {
  SOLO: {
    id: process.env.RAZORPAY_PLAN_SOLO ?? "",
    name: "Solo",
    priceUSD: 12,
    amount: 1200,
    currency: "USD",
    docsPerMonth: 50,
  },
  TEAM: {
    id: process.env.RAZORPAY_PLAN_TEAM ?? "",
    name: "Team",
    priceUSD: 48,
    amount: 4800,
    currency: "USD",
    docsPerMonth: -1,
  },
} as const;

export function getRazorpay() {
  return new Razorpay({
    key_id: requiredEnv("RAZORPAY_KEY_ID"),
    key_secret: requiredEnv("RAZORPAY_KEY_SECRET"),
  });
}

export async function createRazorpayCustomer(name: string, email: string): Promise<string> {
  const customer = await getRazorpay().customers.create({ name, email });
  return customer.id;
}

export async function createSubscription(
  planId: string,
  customerId: string,
  userId: string,
  plan: "SOLO" | "TEAM",
  totalCount = 12
) {
  return getRazorpay().subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: totalCount,
    notes: { customerId, userId, plan },
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return getRazorpay().subscriptions.cancel(subscriptionId);
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return received.length === expected.length && crypto.timingSafeEqual(expected, received);
}

export function verifyPaymentSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !paymentId || !subscriptionId || !signature) return false;

  // Razorpay subscription checkout signature is payment_id|subscription_id.
  const expected = crypto
    .createHmac("sha256", secret)
    .update(paymentId + "|" + subscriptionId)
    .digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return received.length === expected.length && crypto.timingSafeEqual(expected, received);
}
