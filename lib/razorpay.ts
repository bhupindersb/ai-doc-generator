// lib/razorpay.ts
import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Plan config — IDs come from your Razorpay Dashboard
export const PLANS = {
  SOLO: {
    id: process.env.RAZORPAY_PLAN_SOLO!,
    name: "Solo",
    price: 999,       // ₹999/month
    docsPerMonth: 50,
    features: [
      "50 docs/month",
      "All languages supported",
      "README + API + Inline docs",
      "Download as Markdown",
      "Email support",
    ],
  },
  TEAM: {
    id: process.env.RAZORPAY_PLAN_TEAM!,
    name: "Team",
    price: 3999,      // ₹3,999/month
    docsPerMonth: -1, // unlimited
    features: [
      "Unlimited docs",
      "GitHub Action integration",
      "Auto-docs on every PR",
      "Team dashboard",
      "Priority support",
      "API access",
    ],
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

// Verify payment on checkout completion
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + "|" + paymentId;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(signature)
  );
}
