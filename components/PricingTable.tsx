// components/PricingTable.tsx
"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const plans = [
  {
    key: "FREE",
    name: "Free",
    price: 0,
    priceLabel: "₹0",
    period: "forever",
    desc: "Perfect for trying out DocAI",
    features: [
      "5 docs per month",
      "README generation",
      "3 languages supported",
      "Download as Markdown",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    key: "SOLO",
    name: "Solo",
    price: 999,
    priceLabel: "₹999",
    period: "per month",
    desc: "For individual developers",
    features: [
      "50 docs per month",
      "All doc types",
      "20+ languages",
      "API Reference generator",
      "Inline comments",
      "Email support",
    ],
    cta: "Start Solo",
    highlighted: true,
  },
  {
    key: "TEAM",
    name: "Team",
    price: 3999,
    priceLabel: "₹3,999",
    period: "per month",
    desc: "For dev teams who ship fast",
    features: [
      "Unlimited docs",
      "Everything in Solo",
      "GitHub Action included",
      "Auto-docs on every PR",
      "Team dashboard",
      "API access",
      "Priority support",
    ],
    cta: "Start Team",
    highlighted: false,
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PricingTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planKey: string) {
    if (!session) {
      signIn("github");
      return;
    }
    if (planKey === "FREE") {
      router.push("/dashboard");
      return;
    }

    setLoading(planKey);
    try {
      // Create subscription via our API
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const { subscriptionId, keyId } = await res.json();

      // Load Razorpay checkout
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: keyId,
          subscription_id: subscriptionId,
          name: "DocAI",
          description: `${planKey} Plan Subscription`,
          theme: { color: "#C8F135" },
          handler: async (response: any) => {
            // Verify on server
            await fetch("/api/subscribe/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, plan: planKey }),
            });
            router.push("/dashboard?subscribed=true");
          },
        });
        rzp.open();
        setLoading(null);
      };
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.key}
          className={`relative rounded-2xl p-6 border transition-all ${
            plan.highlighted
              ? "bg-violet/10 border-violet lime-glow scale-105"
              : "bg-ink-800 border-ink-600 hover:border-ink-400"
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-ink-900 text-xs font-bold px-3 py-1 rounded-full font-mono">
              MOST POPULAR
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
            <p className="text-ink-400 text-sm mb-4">{plan.desc}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold">{plan.priceLabel}</span>
              <span className="text-ink-400 text-sm">/{plan.period}</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink-100">
                <span className="text-lime text-xs">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.key)}
            disabled={loading === plan.key}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
              plan.highlighted
                ? "bg-lime text-ink-900 hover:bg-lime-dim"
                : "bg-ink-700 text-ink-100 border border-ink-600 hover:border-lime/40 hover:text-lime"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading === plan.key ? "Loading..." : plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
