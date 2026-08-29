"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const plans = [
  {
    key: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Try DocAI with no commitment",
    features: [
      "5 docs per month",
      "README generation",
      "3 languages supported",
      "Markdown download",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    key: "SOLO",
    name: "Solo",
    price: "$12",
    period: "per month",
    desc: "For individual developers",
    features: [
      "50 docs per month",
      "All 4 doc types",
      "20+ languages",
      "API reference generator",
      "Inline comments",
      "Email support",
      "7-day free trial",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    key: "TEAM",
    name: "Team",
    price: "$48",
    period: "per month",
    desc: "For dev teams who ship fast",
    features: [
      "Unlimited docs",
      "Everything in Solo",
      "GitHub Action included",
      "Auto-docs on every PR",
      "Team dashboard",
      "REST API + API keys",
      "Priority support",
      "7-day free trial",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
];

declare global {
  interface Window { Razorpay: any; }
}

export function PricingTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(planKey: string) {
    if (!session) { signIn("github"); return; }
    if (planKey === "FREE") { router.push("/dashboard"); return; }

    setLoading(planKey);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create subscription");
      }

      const { subscriptionId, keyId } = await res.json();

      // Dynamically load Razorpay checkout script
      await new Promise<void>((resolve, reject) => {
        if (window.Razorpay) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(script);
      });

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: "DocAI",
        description: `${planKey} Plan — Monthly`,
        currency: "USD",
        theme: { color: "#C8F135" },
        modal: {
          ondismiss: () => setLoading(null),
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/subscribe/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, plan: planKey }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            router.push("/dashboard?subscribed=true");
          } catch (e: any) {
            setError(e.message);
          } finally {
            setLoading(null);
          }
        },
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-mono text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map(plan => (
          <div
            key={plan.key}
            className={`relative rounded-2xl p-7 border flex flex-col transition-all ${
              plan.highlighted
                ? "bg-violet/8 border-violet violet-glow scale-[1.02]"
                : "bg-ink-800 border-ink-700 hover:border-ink-500"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime text-ink-900 text-xs font-bold font-mono px-4 py-1 rounded-full whitespace-nowrap">
                MOST POPULAR
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <p className="font-display font-bold text-base mb-1">{plan.name}</p>
              <p className="text-xs font-mono text-ink-500 mb-5">{plan.desc}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-display font-bold">{plan.price}</span>
                <span className="text-ink-500 text-sm font-mono">/{plan.period}</span>
              </div>
              {plan.key !== "FREE" && (
                <p className="text-xs font-mono text-lime mt-2">7-day free trial · cancel anytime</p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm font-mono text-ink-300">
                  <span className="text-lime text-xs flex-shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading === plan.key}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                plan.highlighted
                  ? "bg-lime text-ink-900 hover:bg-lime-dim"
                  : plan.key === "FREE"
                  ? "bg-ink-700 text-ink-100 border border-ink-600 hover:bg-ink-600"
                  : "border border-ink-500 text-ink-100 hover:border-lime/40 hover:text-lime"
              }`}
            >
              {loading === plan.key ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs font-mono text-ink-600 mt-6">
        All prices in USD · Payments via Razorpay · Accepts credit cards, UPI & net banking
      </p>
    </div>
  );
}
