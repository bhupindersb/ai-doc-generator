// app/page.tsx
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PricingTable } from "@/components/PricingTable";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-900 relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="grid-bg relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        {/* Glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-ink-800 border border-ink-600 rounded-full px-4 py-1.5 mb-8 text-sm font-mono text-lime">
            <span className="w-2 h-2 bg-lime rounded-full animate-pulse2" />
            Powered by Claude AI
          </div>

          <h1
            className="text-5xl md:text-7xl font-display font-bold leading-[0.95] tracking-tight mb-6"
            style={{ opacity: 0, animation: "fadeUp 0.7s 0.1s ease forwards" }}
          >
            Your Code,
            <br />
            <span className="text-lime">Documented.</span>
            <br />
            <span className="text-ink-200">Instantly.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-ink-200 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ opacity: 0, animation: "fadeUp 0.7s 0.2s ease forwards" }}
          >
            Paste your code and get a complete README, API reference, and inline
            comments in seconds. No more documentation dread.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ opacity: 0, animation: "fadeUp 0.7s 0.3s ease forwards" }}
          >
            <Link
              href="/dashboard"
              className="bg-lime text-ink-900 font-bold px-8 py-4 rounded-lg text-lg hover:bg-lime-dim transition-all hover:scale-105 lime-glow"
            >
              Generate Docs Free →
            </Link>
            <Link
              href="#pricing"
              className="border border-ink-600 text-ink-100 font-semibold px-8 py-4 rounded-lg text-lg hover:border-lime/50 hover:text-lime transition-all"
            >
              See Pricing
            </Link>
          </div>
        </div>

        {/* Demo preview */}
        <div
          className="relative z-10 mt-16 w-full max-w-5xl mx-auto"
          style={{ opacity: 0, animation: "fadeUp 0.7s 0.4s ease forwards" }}
        >
          <div className="bg-ink-800 border border-ink-600 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-600 bg-ink-900">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs font-mono text-ink-200">docai — generate</span>
            </div>
            <div className="grid md:grid-cols-2 divide-x divide-ink-600">
              <div className="p-6">
                <p className="text-xs font-mono text-ink-400 mb-3">INPUT — your code</p>
                <pre className="text-sm font-mono text-lime/80 overflow-auto">
{`function calculateDiscount(
  price, userTier
) {
  const rates = {
    premium: 0.25,
    standard: 0.10,
    free: 0
  };
  return price * (1 - rates[userTier]);
}`}
                </pre>
              </div>
              <div className="p-6">
                <p className="text-xs font-mono text-ink-400 mb-3">OUTPUT — generated docs</p>
                <pre className="text-sm font-mono text-violet-light/80 overflow-auto whitespace-pre-wrap">
{`## calculateDiscount

Applies a tier-based discount to a
given price.

**Parameters**
- \`price\` (number) — Base price
- \`userTier\` (string) — User tier:
  'premium' | 'standard' | 'free'

**Returns** number — Discounted price

**Example**
\`\`\`js
calculateDiscount(100, 'premium')
// → 75
\`\`\``}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-ink-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Everything you need,
            <span className="text-lime"> nothing you don't</span>
          </h2>
          <p className="text-ink-200 text-center mb-16 max-w-xl mx-auto">
            DocAI handles the entire documentation lifecycle so you can focus on shipping.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "README Generator",
                desc: "Auto-generate project READMEs with setup instructions, badges, and usage examples.",
              },
              {
                icon: "🔍",
                title: "API Reference",
                desc: "Document every function, parameter, and return type with auto-detected types.",
              },
              {
                icon: "💬",
                title: "Inline Comments",
                desc: "Get your code back with JSDoc / docstrings added to every function and class.",
              },
              {
                icon: "⚙️",
                title: "GitHub Action",
                desc: "Auto-generate docs on every PR. Team plan includes a plug-and-play Action.",
              },
              {
                icon: "🌐",
                title: "20+ Languages",
                desc: "TypeScript, Python, Go, Rust, Java, C++, PHP, Ruby, and more.",
              },
              {
                icon: "⬇️",
                title: "Export Anywhere",
                desc: "Download as Markdown, copy to clipboard, or push directly to your repo.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-ink-800 border border-ink-600 rounded-xl p-6 hover:border-lime/30 transition-all group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-lime transition-colors">
                  {f.title}
                </h3>
                <p className="text-ink-200 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-ink-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-ink-200 text-center mb-16">
            Start free. Upgrade when you need more.
          </p>
          <PricingTable />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-display font-bold text-xl">
            Doc<span className="text-lime">AI</span>
          </div>
          <p className="text-ink-400 text-sm font-mono">
            © {new Date().getFullYear()} DocAI. Built with Claude + Next.js.
          </p>
          <div className="flex gap-6 text-sm text-ink-400">
            <Link href="/privacy" className="hover:text-lime transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-lime transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
