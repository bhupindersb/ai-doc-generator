// app/docs/page.tsx
import Link from "next/link";
import { PageLayout, PageHero } from "@/components/PageLayout";

const docSections = [
  {
    icon: "🚀",
    title: "Getting Started",
    desc: "Sign in with GitHub, paste your first code snippet, and generate documentation in under 60 seconds.",
    links: [
      { label: "Quick start guide", href: "#quickstart" },
      { label: "Supported languages", href: "#languages" },
      { label: "Doc types explained", href: "#doctypes" },
    ],
  },
  {
    icon: "⚙️",
    title: "GitHub Action",
    desc: "Auto-generate docs on every pull request. Set up once, forget about it forever.",
    links: [
      { label: "Installation guide", href: "/docs/github-action" },
      { label: "Configuration options", href: "/docs/github-action#customisation" },
      { label: "Example workflow file", href: "/docs/github-action#03" },
    ],
  },
  {
    icon: "⚡",
    title: "REST API",
    desc: "Call DocAI from your own scripts, CI pipelines, or IDE plugins using our REST API.",
    links: [
      { label: "Authentication", href: "/docs/api#authentication" },
      { label: "Endpoints reference", href: "/docs/api#endpoints" },
      { label: "Rate limits", href: "/docs/api#rate-limits" },
    ],
  },
  {
    icon: "🔗",
    title: "Integrations",
    desc: "Connect DocAI with GitHub, Notion, Confluence, VS Code, and your CI/CD pipeline.",
    links: [
      { label: "All integrations", href: "/integrations" },
      { label: "GitHub Action setup", href: "/docs/github-action" },
      { label: "Request an integration", href: "mailto:hello@beveez.tech" },
    ],
  },
];

const quickstart = [
  { n: "1", title: "Sign in with GitHub", desc: "Click 'Get started' and authenticate with your GitHub account. No other setup required — we use your GitHub identity." },
  { n: "2", title: "Paste your code", desc: "Go to your dashboard, paste any function, file, or module into the code editor on the left pane." },
  { n: "3", title: "Select a language", desc: "Pick your language from the dropdown (TypeScript, Python, PHP, Go, and 17+ more)." },
  { n: "4", title: "Choose a doc type", desc: "Pick Full Docs (recommended for most cases), README, API Reference, or Inline Comments." },
  { n: "5", title: "Generate", desc: "Click Generate or press ⌘+Enter. Your documentation appears on the right in seconds." },
  { n: "6", title: "Export", desc: "Copy to clipboard, download as a .md file, or use the API to push docs anywhere." },
];

const docTypes = [
  { key: "full",   label: "Full Docs",     desc: "Generates README + API Reference + Inline Comments in one shot. Counts as one generation." },
  { key: "readme", label: "README",        desc: "A complete README.md with project overview, installation steps, usage examples, and badges." },
  { key: "api",    label: "API Reference", desc: "Documents every function, parameter, return type, and includes real code examples." },
  { key: "inline", label: "Inline",        desc: "Returns your code annotated with JSDoc, docstrings, or the language's native comment format." },
];

const languages = [
  "TypeScript","JavaScript","Python","PHP","Go","Rust","Java",
  "C++","C#","Ruby","Swift","Kotlin","Bash","SQL","HTML","CSS","R","Scala","Elixir","Dart"
];

export default function DocsPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Documentation"
        title="DocAI"
        highlight="Developer Docs"
        subtitle="Everything you need to get started, integrate, and build on top of DocAI."
      />

      {/* Section cards */}
      <section className="py-16 px-6 border-b border-ink-800">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docSections.map(s => (
            <div key={s.title} className="bg-ink-800 border border-ink-700 rounded-2xl p-5 hover:border-lime/25 transition-all">
              <div className="text-2xl mb-3">{s.icon}</div>
              <h2 className="font-display font-bold text-sm mb-2">{s.title}</h2>
              <p className="text-xs font-mono text-ink-500 leading-relaxed mb-4">{s.desc}</p>
              <div className="space-y-1.5">
                {s.links.map(l => (
                  <Link key={l.label} href={l.href} className="block text-xs font-mono text-lime hover:underline">
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section id="quickstart" className="py-20 px-6 border-b border-ink-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-2">Quick start</h2>
          <p className="text-ink-400 font-mono text-sm mb-10">From zero to your first generated doc in under 2 minutes.</p>
          <div className="space-y-5">
            {quickstart.map(step => (
              <div key={step.n} className="flex gap-5 items-start">
                <div className="w-9 h-9 bg-lime/10 border border-lime/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-display font-bold text-lime">{step.n}</span>
                </div>
                <div>
                  <p className="font-display font-bold text-sm mb-1">{step.title}</p>
                  <p className="text-xs font-mono text-ink-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/dashboard" className="bg-lime text-ink-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-lime-dim transition-all inline-block">
              Open the dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Doc types */}
      <section id="doctypes" className="py-20 px-6 border-b border-ink-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-2">Doc types</h2>
          <p className="text-ink-400 font-mono text-sm mb-10">Four types of documentation, each optimised for a different purpose.</p>
          <div className="space-y-4">
            {docTypes.map(dt => (
              <div key={dt.key} className="bg-ink-800 border border-ink-700 rounded-xl px-5 py-4 flex items-start gap-4">
                <code className="text-xs font-mono text-lime bg-lime/10 border border-lime/20 px-2.5 py-1 rounded-lg flex-shrink-0 mt-0.5">{dt.key}</code>
                <div>
                  <p className="font-display font-bold text-sm mb-1">{dt.label}</p>
                  <p className="text-xs font-mono text-ink-400 leading-relaxed">{dt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-2">Supported languages</h2>
          <p className="text-ink-400 font-mono text-sm mb-8">20+ languages with native comment style and type annotation support.</p>
          <div className="flex flex-wrap gap-2">
            {languages.map(l => (
              <span key={l} className="bg-ink-800 border border-ink-700 text-lime/80 text-xs font-mono px-3 py-1.5 rounded-lg">
                {l}
              </span>
            ))}
          </div>
          <div className="mt-12 bg-ink-800 border border-ink-700 rounded-2xl p-6">
            <p className="font-display font-bold text-sm mb-2">Need a language not listed?</p>
            <p className="text-xs font-mono text-ink-400 mb-4">Email us and we'll add it to the next release.</p>
            <a href="mailto:hello@beveez.tech" className="text-xs font-mono text-lime hover:underline">hello@beveez.tech →</a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
