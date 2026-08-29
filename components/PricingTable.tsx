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
    cta: "Get started",
    highlighted: false,
    color: "",
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
    color: "border-violet",
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
    color: "",
  },
];

declare global {
  interface Window { Razorpay: any; }
}

export function PricingTable() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planKey: string) {
    if (!session) { signIn("github"); return; }
    if (planKey === "FREE") { router.push("/dashboard"); return; }

    setLoading(planKey);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const { subscriptionId, keyId } = await res.json();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: keyId,
          subscription_id: subscriptionId,
          name: "DocAI",
          description: `${planKey} Plan — Monthly`,
          currency: "USD",
          theme: { color: "#C8F135" },
          handler: async (response: any) => {
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
    <div className="grid md:grid-cols-3 gap-5">
      {plans.map(plan => (
        <div
          key={plan.key}
          className={`relative rounded-2xl p-7 border transition-all flex flex-col ${
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

          {/* Plan header */}
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
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              plan.highlighted
                ? "bg-lime text-ink-900 hover:bg-lime-dim"
                : plan.key === "FREE"
                  ? "bg-ink-700 text-ink-100 border border-ink-600 hover:bg-ink-600"
                  : "border border-ink-500 text-ink-100 hover:border-lime/40 hover:text-lime"
            }`}
          >
            {loading === plan.key
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading…
                </span>
              : plan.cta
            }
          </button>
        </div>
      ))}
    </div>
  );
}
