import { PageLayout, PageHero } from "@/components/PageLayout";
import { PricingTable } from "@/components/PricingTable";
import Link from "next/link";

const faqs = [
  { q: "Do I need a credit card for the free plan?", a: "No. The free plan gives you 5 docs per month with zero payment info required. Just sign in with GitHub and start generating." },
  { q: "What counts as one 'doc'?", a: "Each time you click Generate, that counts as one doc — regardless of which type you pick (README, API, Inline, or Full). Full Docs generates all three in a single request and counts as one." },
  { q: "Can I cancel anytime?", a: "Yes, absolutely. Contact support to request cancellation. Subscription status is confirmed through Razorpay." },
  { q: "Is there a free trial on paid plans?", a: "No. Paid subscriptions begin when you complete the Razorpay authorisation checkout." },
  { q: "What payment methods do you accept?", a: "Payments are processed through Razorpay. Available payment methods depend on your location and the merchant account approvals." },
  { q: "Do you offer refunds?", a: "For billing questions or refund requests, contact hello@beveez.tech. Requests are reviewed under the applicable payment and refund terms." },
  { q: "What's the difference between Solo and Team?", a: "Solo includes 50 documents per month. Team is intended for higher-volume documentation use, with the same generation formats and language support." },
  { q: "Can I use DocAI in my CI/CD pipeline?", a: "Public API access and customer-managed API keys are not yet generally available. They are planned for a future release." },
];

export default function PricingPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Pricing"
        title="Simple pricing,"
        highlight="no surprises"
        subtitle="Start free. Upgrade when you need more. Cancel anytime — no lock-in, no hidden fees."
      />

      {/* Pricing table */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <PricingTable />
          <p className="text-center text-xs font-mono text-ink-600 mt-8">
            Paid subscriptions · Payments via Razorpay · Prices shown in USD
          </p>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-16 px-6 border-t border-ink-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center mb-12">Full plan comparison</h2>
          <div className="bg-ink-800 border border-ink-700 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="text-left px-6 py-4 font-display font-bold text-ink-300">Feature</th>
                  {["Free", "Solo", "Team"].map(p => (
                    <th key={p} className={`px-6 py-4 font-display font-bold text-center ${p === "Solo" ? "text-violet-light" : "text-ink-300"}`}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                {[
                  ["Docs per month",          "5",       "50",        "Unlimited"],
                  ["README generation",       "✓",       "✓",         "✓"],
                  ["API reference",           "✓",       "✓",         "✓"],
                  ["Inline comments",         "✓",       "✓",         "✓"],
                  ["Full docs (all 3)",       "✓",       "✓",         "✓"],
                  ["Languages supported",     "22",      "22",        "22"],
                  ["Markdown download",       "✓",       "✓",         "✓"],
                  ["High-volume usage tier",  "—",       "—",         "✓"],
                  ["Priority support",        "—",       "Email",     "Priority"],
                  ["Free trial",              "—",       "—",         "—"],
                ].map(([feat, ...vals]) => (
                  <tr key={feat} className="hover:bg-ink-700/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-ink-300 text-xs">{feat}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`px-6 py-3.5 text-center text-xs font-mono ${
                        v === "✓" ? "text-lime" : v === "—" ? "text-ink-600" : i === 1 ? "text-violet-light font-bold" : "text-ink-300"
                      }`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-t border-ink-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
                <p className="font-display font-bold text-sm mb-2">{faq.q}</p>
                <p className="text-ink-400 font-mono text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-ink-800 text-center">
        <h2 className="text-2xl font-display font-bold mb-3">Still have questions?</h2>
        <p className="text-ink-400 font-mono text-sm mb-6">Email us at <span className="text-lime">hello@beveez.tech</span> — we reply within 24 hours.</p>
        <Link href="/dashboard" className="bg-lime text-ink-900 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-lime-dim transition-all inline-block">
          Start free →
        </Link>
      </section>
    </PageLayout>
  );
}
