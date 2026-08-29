// components/PageLayout.tsx
import Link from "next/link";
import { Navbar } from "./Navbar";

const footerLinks = {
  Product: [
    { label: "Features",     href: "/features" },
    { label: "Pricing",      href: "/pricing" },
    { label: "Roadmap",      href: "/roadmap" },
    { label: "Integrations", href: "/integrations" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference",  href: "/docs/api" },
    { label: "GitHub Action",  href: "/docs/github-action" },
    { label: "Status",         href: "#" },
  ],
  Company: [
    { label: "About",   href: "#" },
    { label: "Blog",    href: "#" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms",   href: "/terms" },
  ],
};

const FooterLogo = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#C8F135" />
    <rect x="10" y="13" width="16" height="2.5" rx="1.25" fill="#0A0A0F" />
    <rect x="10" y="19" width="24" height="2.5" rx="1.25" fill="#0A0A0F" />
    <rect x="10" y="25" width="20" height="2.5" rx="1.25" fill="#0A0A0F" />
    <circle cx="33" cy="13" r="4" fill="#0A0A0F" />
    <path d="M31 13L32.5 14.5L35.5 11.5" stroke="#C8F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 overflow-x-hidden">
      <Navbar />
      <main className="pt-16">{children}</main>

      <footer className="border-t border-ink-800 py-16 px-6 mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 mb-12">
            <div className="md:w-64 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <FooterLogo />
                <span className="font-display font-bold text-xl">Doc<span className="text-lime">AI</span></span>
              </Link>
              <p className="text-ink-500 text-sm font-mono leading-relaxed mb-5">
                AI-powered documentation for developers who ship fast.
              </p>
              <div className="flex gap-2">
                {[{ l: "GH", h: "#" }, { l: "TW", h: "#" }].map(s => (
                  <a key={s.l} href={s.h} className="w-9 h-9 bg-ink-800 border border-ink-700 rounded-lg flex items-center justify-center text-xs font-mono text-ink-400 hover:text-lime hover:border-lime/30 transition-all">
                    {s.l}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <p className="font-display font-bold text-sm mb-4 text-ink-200">{group}</p>
                  <div className="space-y-2.5">
                    {links.map(l => (
                      <p key={l.label}>
                        <Link href={l.href} className="text-sm font-mono text-ink-500 hover:text-lime transition-colors">
                          {l.label}
                        </Link>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-ink-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-mono text-ink-600">© {new Date().getFullYear()} DocAI by Beveez Tech. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs font-mono text-ink-600 flex-wrap justify-center">
              <span>Built with Claude AI + Next.js</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-lime rounded-full" />All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHero({ badge, title, highlight, subtitle }: {
  badge: string; title: string; highlight: string; subtitle: string;
}) {
  return (
    <div className="relative py-24 px-6 text-center border-b border-ink-800">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-ink-800 border border-ink-700 rounded-full px-4 py-1.5 mb-8 text-xs font-mono text-lime">
          <span className="w-1.5 h-1.5 bg-lime rounded-full" />{badge}
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-5 leading-[0.92]">
          {title}<br /><span className="text-lime">{highlight}</span>
        </h1>
        <p className="text-ink-400 font-mono text-base leading-relaxed max-w-xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}
