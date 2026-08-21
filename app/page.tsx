// app/page.tsx
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PricingTable } from "@/components/PricingTable";

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#C8F135" />
    <rect x="10" y="13" width="16" height="2.5" rx="1.25" fill="#0A0A0F" />
    <rect x="10" y="19" width="24" height="2.5" rx="1.25" fill="#0A0A0F" />
    <rect x="10" y="25" width="20" height="2.5" rx="1.25" fill="#0A0A0F" />
    <circle cx="33" cy="13" r="4" fill="#0A0A0F" />
    <path d="M31 13L32.5 14.5L35.5 11.5" stroke="#C8F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features = [
  { icon: "📄", title: "README Generator", desc: "Auto-generate project READMEs with setup instructions, badges, and usage examples.", color: "#C8F135" },
  { icon: "🔍", title: "API Reference", desc: "Document every function, parameter, and return type with auto-detected types and examples.", color: "#a78bfa" },
  { icon: "💬", title: "Inline Comments", desc: "Get your code back with JSDoc and docstrings added to every function and class.", color: "#C8F135" },
  { icon: "⚙️", title: "GitHub Action", desc: "Auto-generate docs on every PR. Team plan includes a plug-and-play Action you add in 60 seconds.", color: "#a78bfa" },
  { icon: "🌐", title: "20+ Languages", desc: "TypeScript, Python, Go, Rust, Java, C++, PHP, Ruby, Swift, Kotlin, SQL, and more.", color: "#C8F135" },
  { icon: "⬇️", title: "Export Anywhere", desc: "Download as Markdown, copy to clipboard, or push directly to your GitHub repository.", color: "#a78bfa" },
];

const steps = [
  { n: "01", title: "Paste your code", desc: "Paste any function, file, or module. Works with 20+ languages — no config needed." },
  { n: "02", title: "Pick a doc type", desc: "Choose README, API reference, inline comments, or generate all three at once." },
  { n: "03", title: "Download and ship", desc: "Copy to clipboard, download as .md, or push straight to your GitHub repo." },
];

const testimonials = [
  { name: "Arjun Mehta", role: "Senior Engineer @ Razorpay", text: "Saved our team hours every sprint. The GitHub Action integration is seamless — it just works.", avatar: "AM" },
  { name: "Priya Sharma", role: "Indie Hacker", text: "Finally shipped docs for my side project. Took 10 seconds instead of 10 hours. Genuinely magical.", avatar: "PS" },
  { name: "Rahul Gupta", role: "CTO @ DevStartup", text: "The API reference generation alone is worth the subscription. Output quality is incredible for PHP.", avatar: "RG" },
];

const stats = [
  { value: "20+", label: "Languages" },
  { value: "<2s", label: "Generation time" },
  { value: "4", label: "Doc types" },
  { value: "99.9%", label: "Uptime" },
];

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Developers: ["API Docs", "GitHub Action", "Integrations", "Status"],
  Company: ["About", "Blog", "Privacy", "Terms"],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-900 overflow-x-hidden">
      <Navbar />

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-violet/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[200px] bg-lime/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2.5 bg-ink-800 border border-ink-600 rounded-full px-5 py-2 mb-10 text-xs font-mono text-lime tracking-wide"
            style={{ opacity: 0, animation: "fadeUp 0.6s 0.05s ease forwards" }}
          >
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse2 flex-shrink-0" />
            AI-Powered Documentation · Built for Developers
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse2 flex-shrink-0" />
          </div>

          {/* Main headline */}
          <h1
            className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6 leading-[0.88]"
            style={{ opacity: 0, animation: "fadeUp 0.65s 0.1s ease forwards" }}
          >
            <span className="block text-ink-100">Your Code,</span>
            <span className="block text-lime">Documented.</span>
            <span className="block text-ink-600">Instantly.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-base md:text-lg text-ink-300 max-w-2xl mx-auto mb-10 leading-relaxed font-mono"
            style={{ opacity: 0, animation: "fadeUp 0.65s 0.18s ease forwards" }}
          >
            Paste your code and get a complete README, API reference, and inline
            comments in seconds — powered by AI. Stop dreading documentation.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center gap-3 mb-12"
            style={{ opacity: 0, animation: "fadeUp 0.65s 0.25s ease forwards" }}
          >
            <Link
              href="/dashboard"
              className="bg-lime text-ink-900 font-bold px-8 py-4 rounded-xl text-sm hover:bg-lime-dim transition-all hover:scale-[1.03] lime-glow inline-flex items-center gap-2"
            >
              Generate docs free
              <span className="text-base">→</span>
            </Link>
            <Link
              href="#demo"
              className="border border-ink-600 text-ink-200 font-semibold px-8 py-4 rounded-xl text-sm hover:border-lime/40 hover:text-lime transition-all inline-flex items-center gap-2"
            >
              <span>▶</span>
              See it in action
            </Link>
          </div>

          {/* Social proof avatars */}
          <div
            className="flex flex-col sm:flex-row items-center gap-4"
            style={{ opacity: 0, animation: "fadeUp 0.65s 0.32s ease forwards" }}
          >
            <div className="flex items-center">
              {["#7C3AED", "#C8F135", "#5a5a80", "#a78bfa", "#F0F0F5", "#ef4444"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-ink-900 relative"
                  style={{ background: c, marginLeft: i ? "-10px" : "0", zIndex: 6 - i }}
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1 justify-center sm:justify-start mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lime text-xs">★</span>
                ))}
              </div>
              <p className="text-xs font-mono text-ink-400">
                Loved by <span className="text-lime font-bold">240+</span> developers this week
              </p>
            </div>
          </div>
        </div>

        {/* ── LIVE DEMO WINDOW ── */}
        <div
          id="demo"
          className="relative z-10 mt-20 w-full max-w-5xl mx-auto"
          style={{ opacity: 0, animation: "fadeUp 0.7s 0.4s ease forwards" }}
        >
          <div className="bg-ink-800 border border-ink-600 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-ink-600 bg-ink-900/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-3 text-xs font-mono text-ink-500 flex-1">
                docs.beveez.tech — generate documentation
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse2" />
                <span className="text-xs font-mono text-lime">live</span>
              </div>
            </div>

            {/* Language + type selector bar */}
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-ink-700 bg-ink-800/60">
              <div className="flex gap-1.5">
                {["Full Docs", "README", "API Ref", "Inline"].map((t, i) => (
                  <span
                    key={t}
                    className={`text-xs font-mono px-2.5 py-1 rounded-md ${
                      i === 0
                        ? "bg-lime text-ink-900 font-bold"
                        : "text-ink-400 hover:text-ink-200"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="ml-auto">
                <span className="text-xs font-mono bg-ink-700 border border-ink-600 text-lime px-2.5 py-1 rounded-md">
                  php
                </span>
              </div>
            </div>

            {/* Split code panes */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-700">
              {/* Input */}
              <div className="p-6">
                <p className="text-xs font-mono text-ink-500 mb-4 tracking-wider uppercase">
                  ← Input
                </p>
                <pre className="text-sm font-mono text-lime/85 leading-relaxed overflow-x-auto">{`<?php
/**
 * header.php - Application bootstrap
 */
define('SITE_NAME', 'Beveez');
define('VERSION', '2.1.0');

session_start();

function getAuthUser() {
  if (!isset($_SESSION['user_id'])) {
    return null;
  }
  $db = Database::connect();
  return $db->query(
    "SELECT * FROM users WHERE id = ?",
    [$_SESSION['user_id']]
  )->fetch();
}`}
                </pre>
              </div>

              {/* Output */}
              <div className="p-6">
                <p className="text-xs font-mono text-ink-500 mb-4 tracking-wider uppercase">
                  → Generated docs
                </p>
                <div className="space-y-3 text-sm font-mono">
                  <p className="text-lime font-bold text-base">## header.php</p>
                  <p className="text-ink-300 leading-relaxed">
                    Application bootstrap file for Beveez v2.1.0. Initialises the
                    session, defines global constants, and loads the authenticated
                    user context.
                  </p>
                  <div className="border-t border-ink-700 pt-3 space-y-1">
                    <p className="text-violet-light font-bold text-xs uppercase tracking-wider mb-2">Constants</p>
                    <p className="text-ink-400 text-xs"><span className="text-lime/70">`SITE_NAME`</span> — Application display name</p>
                    <p className="text-ink-400 text-xs"><span className="text-lime/70">`VERSION`</span> — Semantic version string</p>
                  </div>
                  <div className="border-t border-ink-700 pt-3 space-y-1">
                    <p className="text-violet-light font-bold text-xs uppercase tracking-wider mb-2">Functions</p>
                    <p className="text-ink-300 text-xs font-bold">getAuthUser()</p>
                    <p className="text-ink-400 text-xs">Retrieves the currently authenticated user from the database using the active session.</p>
                    <p className="text-ink-600 text-xs mt-1">@return array|null — User row or null if unauthenticated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="px-5 py-3 border-t border-ink-700 bg-ink-900/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-ink-500">18 lines · php · 1.2s</span>
                <span className="text-xs font-mono text-ink-600">◆ Full README + API + Inline generated</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-mono bg-ink-700 text-ink-300 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-ink-600 transition-all">
                  Copy
                </span>
                <span className="text-xs font-mono bg-ink-700 text-ink-300 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-ink-600 transition-all">
                  ↓ .md
                </span>
                <span className="text-xs font-mono bg-lime text-ink-900 font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                  Generate ✦
                </span>
              </div>
            </div>
          </div>

          {/* Floating trust badges below demo */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              "✓ No credit card required",
              "✓ Free tier available",
              "✓ Works with PHP, Python, JS, Go + 16 more",
            ].map((b) => (
              <span key={b} className="text-xs font-mono text-ink-400">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── STATS BAR ─────────────────── */}
      <section className="border-y border-ink-800 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-display font-bold text-lime mb-1">{s.value}</p>
              <p className="text-xs font-mono text-ink-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── FEATURES ─────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-lime mb-4 tracking-widest uppercase">What you get</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
              Everything you need,
              <br />
              <span className="text-lime">nothing you don't</span>
            </h2>
            <p className="text-ink-400 max-w-lg mx-auto font-mono text-sm leading-relaxed">
              DocAI handles the full documentation lifecycle so your team can focus on shipping.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-ink-800 border border-ink-700 rounded-2xl p-6 hover:border-lime/25 hover:bg-ink-800/80 transition-all cursor-default"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}25`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-base mb-2 group-hover:text-lime transition-colors">
                  {f.title}
                </h3>
                <p className="text-ink-500 text-sm leading-relaxed font-mono">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section className="py-28 px-6 border-t border-ink-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-lime mb-4 tracking-widest uppercase">How it works</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Three steps to
              <span className="text-lime"> perfect docs</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector lines (desktop only) */}
            {/* <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-lime/20 via-lime/40 to-lime/20" /> */}

            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-lime/10 border border-lime/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-display font-bold text-lime">{s.n}</span>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-lime/20 to-transparent" />
                  )}
                </div>
                <h3 className="font-display font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed font-mono">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── LANGUAGE MARQUEE ─────────────────── */}
      <section className="py-16 px-6 border-t border-ink-800 overflow-hidden">
        <p className="text-xs font-mono text-ink-400 text-center mb-6 uppercase tracking-widest">
          Works with every language your team uses
        </p>
        <div className="flex gap-3 flex-wrap justify-center max-w-4xl mx-auto">
          {[
            "TypeScript", "JavaScript", "Python", "PHP", "Go", "Rust",
            "Java", "C++", "C#", "Ruby", "Swift", "Kotlin", "Bash",
            "SQL", "HTML/CSS", "R", "Scala", "Elixir",
          ].map((lang) => (
            <span
              key={lang}
              className="bg-ink-800 border border-ink-700 text-ink-300 text-xs font-mono px-3 py-1.5 rounded-full hover:border-lime/30 hover:text-lime transition-all cursor-default"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────────────── TESTIMONIALS ─────────────────── */}
      <section className="py-28 px-6 border-t border-ink-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-lime mb-4 tracking-widest uppercase">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Loved by developers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-ink-800 border border-ink-700 rounded-2xl p-7 flex flex-col"
              >
                {/* Stars */}
                <div className="flex mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lime text-sm">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="text-ink-200 text-sm leading-relaxed font-mono flex-1 mb-6">
                  "{t.text}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 border-t border-ink-700 pt-5">
                  <div className="w-10 h-10 rounded-full bg-violet/25 border border-violet/35 flex items-center justify-center text-xs font-bold text-violet-light flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold font-display">{t.name}</p>
                    <p className="text-xs text-ink-500 font-mono mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── PRICING ─────────────────── */}
      <section id="pricing" className="py-28 px-6 border-t border-ink-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-lime mb-4 tracking-widest uppercase">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
              Simple, honest pricing
            </h2>
            <p className="text-ink-400 font-mono text-sm">
              Start free. Upgrade when you need more. Cancel anytime.
            </p>
          </div>
          <PricingTable />

          {/* FAQ nudge */}
          <p className="text-center text-xs font-mono text-ink-500 mt-10">
            All plans include a 7-day free trial on paid tiers.{" "}
            <span className="text-lime cursor-pointer hover:underline">Questions? Chat with us →</span>
          </p>
        </div>
      </section>

      {/* ─────────────────── CTA BANNER ─────────────────── */}
      <section className="py-16 px-6 border-t border-ink-800">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-ink-800 border border-ink-700 rounded-3xl p-14 text-center overflow-hidden">
            {/* BG decoration */}
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-violet/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 bg-lime rounded-full" />
                <span className="text-xs font-mono text-lime">Free tier — no card needed</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
                Start documenting in
                <br />
                <span className="text-lime">30 seconds</span>
              </h2>
              <p className="text-ink-400 font-mono text-sm mb-10 max-w-md mx-auto leading-relaxed">
                Join 240+ developers who stopped dreading documentation. Free tier
                includes 5 docs per month — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-lime text-ink-900 font-bold px-10 py-4 rounded-xl text-sm hover:bg-lime-dim transition-all hover:scale-[1.03] lime-glow"
                >
                  Generate your first doc →
                </Link>
                <Link
                  href="#pricing"
                  className="border border-ink-600 text-ink-200 font-semibold px-8 py-4 rounded-xl text-sm hover:border-lime/40 hover:text-lime transition-all"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="border-t border-ink-800 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 mb-12">
            {/* Brand col */}
            <div className="md:w-64 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <Logo />
                <span className="font-display font-bold text-2xl">
                  Doc<span className="text-lime">AI</span>
                </span>
              </div>
              <p className="text-ink-500 text-sm font-mono leading-relaxed mb-5">
                AI-powered documentation for developers who ship fast. Built on{" "}
                <span className="text-lime">docs.beveez.tech</span>
              </p>
              {/* Social links */}
              <div className="flex gap-3">
                {[
                  { label: "GitHub", icon: "GH" },
                  { label: "Twitter", icon: "TW" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="w-9 h-9 bg-ink-800 border border-ink-700 rounded-lg flex items-center justify-center text-xs font-mono text-ink-400 hover:text-lime hover:border-lime/30 transition-all"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <p className="font-display font-bold text-sm mb-4 text-ink-200">{group}</p>
                  <div className="space-y-2.5">
                    {links.map((l) => (
                      <p key={l}>
                        <Link
                          href="#"
                          className="text-sm font-mono text-ink-500 hover:text-lime transition-colors"
                        >
                          {l}
                        </Link>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-ink-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-mono text-ink-400">
              © {new Date().getFullYear()} DocAI by Beveez Tech. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs font-mono text-ink-400">
              <span>Built with Claude AI + Next.js</span>
              <span>·</span>
              <span>Hosted on Vercel</span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-lime rounded-full" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
