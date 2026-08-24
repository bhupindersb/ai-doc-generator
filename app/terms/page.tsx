import { PageLayout } from "@/components/PageLayout";

const sections = [
  {
    title: "1. Acceptance of terms",
    text: "By creating an account or using DocAI (available at docs.beveez.tech), you agree to these Terms of Service. If you do not agree, do not use the service. These terms form a binding contract between you and Beveez Tech.",
  },
  {
    title: "2. The service",
    text: "DocAI is an AI-powered documentation generation tool. We provide a web interface and API that accepts source code and generates documentation including READMEs, API references, and inline comments. We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.",
  },
  {
    title: "3. Accounts",
    text: "You must sign in with a valid GitHub account. You are responsible for maintaining the security of your account. You must not share your account or API keys with others outside your team. You must be at least 13 years old to use DocAI. You must provide accurate information and keep it up to date.",
  },
  {
    title: "4. Acceptable use",
    paras: [
      { sub: "You may not use DocAI to:", bullets: [
        "Generate documentation for malicious code, malware, or software designed to harm others",
        "Submit code that infringes third-party intellectual property rights",
        "Attempt to reverse-engineer, scrape, or extract our AI models or training data",
        "Circumvent rate limits, plan limits, or access controls through technical means",
        "Resell or white-label the service without an explicit enterprise agreement",
        "Submit personally identifiable information (PII) belonging to third parties",
      ]},
      { sub: "You are responsible for ensuring:", bullets: [
        "You have the right to submit the code you paste into DocAI",
        "The code does not contain production secrets, API keys, or passwords",
        "Your use complies with applicable laws in your jurisdiction",
      ]},
    ],
  },
  {
    title: "5. Intellectual property",
    text: "Your code remains yours. The documentation generated from your code is also yours — you own it fully and may use it without restriction. We claim no intellectual property rights over your inputs or outputs. DocAI, the DocAI logo, and the service itself are owned by Beveez Tech.",
  },
  {
    title: "6. Payment and subscriptions",
    paras: [
      { sub: "Billing", text: "Paid plans are billed monthly via Razorpay. Your subscription renews automatically on the same date each month. By subscribing, you authorise us to charge your payment method on a recurring basis." },
      { sub: "Free trial", text: "Paid plans include a 7-day free trial. You will not be charged until the trial ends. You may cancel at any time during the trial at no cost." },
      { sub: "Refunds", text: "We offer a 7-day money-back guarantee on first-time paid subscriptions. After 7 days, payments are non-refundable. To request a refund, email hello@beveez.tech within 7 days of your first charge." },
      { sub: "Plan changes", text: "You may upgrade or downgrade your plan at any time. Upgrades take effect immediately. Downgrades take effect at the end of the current billing period." },
      { sub: "Failed payments", text: "If a payment fails, we will retry twice over 5 days. If the payment remains unpaid, your account will be downgraded to the Free plan until payment is resolved." },
    ],
  },
  {
    title: "7. Limitation of liability",
    text: "To the maximum extent permitted by applicable law, Beveez Tech is not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of DocAI — including but not limited to loss of data, loss of revenue, or inaccurate documentation. Our total liability for any claim is limited to the amount you paid us in the 3 months preceding the claim.",
  },
  {
    title: "8. Disclaimer of warranties",
    text: "DocAI is provided \"as is\" without warranties of any kind. We do not warrant that the service will be error-free, uninterrupted, or that the generated documentation will be accurate, complete, or suitable for any particular purpose. You use the generated documentation at your own risk and should always review it before publishing.",
  },
  {
    title: "9. Indemnification",
    text: "You agree to indemnify and hold harmless Beveez Tech and its team from any claims, losses, or damages arising from your violation of these terms, your use of the service, or your infringement of any third-party rights.",
  },
  {
    title: "10. Termination",
    text: "You may terminate your account at any time by contacting hello@beveez.tech. We may suspend or terminate your account if you violate these terms, with or without notice depending on the severity of the violation. On termination, your right to use the service ceases immediately. We will delete your data within 30 days as described in our Privacy Policy.",
  },
  {
    title: "11. Governing law",
    text: "These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts of Punjab, India.",
  },
  {
    title: "12. Changes to these terms",
    text: "We may update these terms at any time. We will notify you by email at least 14 days before material changes take effect. Your continued use of the service after the effective date constitutes acceptance of the new terms.",
  },
  {
    title: "13. Contact",
    text: "Beveez Tech · Kharar, Punjab, India · hello@beveez.tech",
  },
];

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Header */}
      <div className="border-b border-ink-800 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-ink-800 border border-ink-700 rounded-full px-4 py-1.5 mb-6 text-xs font-mono text-lime">
            <span className="w-1.5 h-1.5 bg-lime rounded-full" />Terms of Service
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Terms of Service</h1>
          <p className="text-ink-400 font-mono text-sm">
            Last updated: 1 August 2026 · Effective: 1 August 2026
          </p>
          <p className="text-ink-400 font-mono text-sm mt-4 leading-relaxed">
            Please read these terms carefully before using DocAI. By using the service, you agree to be bound by them.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map(section => (
            <div key={section.title} className="border-b border-ink-800 pb-10 last:border-0">
              <h2 className="text-base font-display font-bold mb-4 text-lime">{section.title}</h2>
              {"text" in section && (
                <p className="text-ink-400 font-mono text-sm leading-relaxed">{section.text}</p>
              )}
              {"paras" in section && section.paras && (
                <div className="space-y-5">
                  {section.paras.map((p, i) => (
                    <div key={i}>
                      <p className="font-display font-bold text-sm mb-2">{p.sub}</p>
                      {"text" in p && p.text && (
                        <p className="text-ink-400 font-mono text-sm leading-relaxed">{p.text}</p>
                      )}
                      {"bullets" in p && p.bullets && (
                        <ul className="space-y-1.5">
                          {p.bullets.map(b => (
                            <li key={b} className="flex items-start gap-2.5 text-sm font-mono text-ink-400">
                              <span className="text-ink-600 mt-0.5 flex-shrink-0">·</span>{b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact box */}
          <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6 text-center">
            <p className="font-display font-bold text-sm mb-2">Questions about these terms?</p>
            <p className="text-ink-400 font-mono text-sm mb-4">Email us — we reply within 48 hours.</p>
            <a href="mailto:hello@beveez.tech" className="text-lime font-mono text-sm hover:underline">hello@beveez.tech →</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
