// lib/razorpay.ts
import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// USD pricing
// IMPORTANT: Plans must be created in USD in Razorpay dashboard
// Plan amounts are in smallest currency unit:
// USD: cents ($12 = 1200 cents, $48 = 4800 cents)
export const PLANS = {
  SOLO: {
    id: process.env.RAZORPAY_PLAN_SOLO!,
    name: "Solo",
    priceUSD: 12,
    amount: 1200, // in cents
    currency: "USD",
    docsPerMonth: 50,
  },
  TEAM: {
    id: process.env.RAZORPAY_PLAN_TEAM!,
    name: "Team",
    priceUSD: 48,
    amount: 4800, // in cents
    currency: "USD",
    docsPerMonth: -1,
  },
} as const;

export async function createRazorpayCustomer(
  name: string,
  email: string
): Promise<string> {
  const customer = await razorpay.customers.create({ name, email });
  return customer.id;
}

export async function createSubscription(
  planId: string,
  customerId: string,
  totalCount = 12
) {
  return await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: totalCount,
    notes: { customerId },
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await razorpay.subscriptions.cancel(subscriptionId);
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(signature)
  );
}

export function verifyPaymentSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = subscriptionId + "|" + paymentId;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(signature)
  );
}
