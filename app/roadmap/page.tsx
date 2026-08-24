import { PageLayout, PageHero } from "@/components/PageLayout";

const roadmap = [
  {
    quarter: "Q2 2026",
    status: "shipped",
    label: "Shipped",
    items: [
      { title: "Core doc generation", desc: "README, API reference, and inline comments via Claude AI." },
      { title: "20+ language support", desc: "TypeScript, Python, PHP, Go, Rust, Java, and 14 more." },
      { title: "GitHub OAuth login", desc: "Sign in with your GitHub account in one click." },
      { title: "Razorpay subscriptions", desc: "Free, Solo (₹999/mo), and Team (₹3,999/mo) plans." },
      { title: "Markdown download", desc: "Export any generated doc as a .md file instantly." },
      { title: "Usage metering", desc: "Per-plan limits tracked and enforced in real time." },
    ],
  },
  {
    quarter: "Q3 2026",
    status: "building",
    label: "Building now",
    items: [
      { title: "GitHub Action", desc: "Auto-generate docs on every PR — plug-and-play YAML." },
      { title: "REST API + API Keys", desc: "Call DocAI from your own scripts, pipelines, or IDE plugins." },
      { title: "Team dashboard", desc: "See usage across all team members, manage seats, and set limits." },
      { title: "Notion export", desc: "Push generated docs directly to your Notion workspace." },
      { title: "Confluence export", desc: "One-click publish to Confluence spaces." },
    ],
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    label: "Planned",
    items: [
      { title: "VS Code extension", desc: "Generate docs without leaving your editor." },
      { title: "JetBrains plugin", desc: "Full PhpStorm, IntelliJ, and PyCharm support." },
      { title: "Doc versioning", desc: "Track doc changes across git commits and view diffs." },
      { title: "Custom style guides", desc: "Train DocAI on your team's writing style and terminology." },
      { title: "Multi-file project docs", desc: "Upload a full repo and generate an entire docs site." },
    ],
  },
  {
    quarter: "2027",
    status: "future",
    label: "Future",
    items: [
      { title: "AI doc chat", desc: "Ask questions about your codebase — DocAI answers using your own docs." },
      { title: "Auto-sync on push", desc: "Docs automatically regenerate whenever code changes are pushed." },
      { title: "White-label API", desc: "Embed DocAI into your own product under your brand." },
      { title: "Enterprise SSO", desc: "SAML and OIDC support for large organisations." },
    ],
  },
];

const statusStyles: Record<string, { dot: string; badge: string; border: string }> = {
  shipped:  { dot: "bg-lime",        badge: "text-lime bg-lime/10 border-lime/25",           border: "border-lime/20" },
  building: { dot: "bg-violet",      badge: "text-violet-light bg-violet/10 border-violet/25", border: "border-violet/20" },
  planned:  { dot: "bg-ink-400",     badge: "text-ink-300 bg-ink-700 border-ink-600",         border: "border-ink-700" },
  future:   { dot: "bg-ink-600",     badge: "text-ink-500 bg-ink-800 border-ink-700",         border: "border-ink-800" },
};

export default function RoadmapPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Roadmap"
        title="What we're building"
        highlight="and what's coming next"
        subtitle="Our public roadmap — shipped features, what's in progress, and what's planned. Updated every sprint."
      />

      {/* Legend */}
      <div className="px-6 py-8 border-b border-ink-800">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">
          {Object.entries(statusStyles).map(([key, s]) => (
            <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${s.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {roadmap.map((phase) => {
            const s = statusStyles[phase.status];
            return (
              <div key={phase.quarter}>
                {/* Phase header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot} ${phase.status === "building" ? "animate-pulse2" : ""}`} />
                  <h2 className="text-xl font-display font-bold">{phase.quarter}</h2>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full border ${s.badge}`}>
                    {phase.label}
                  </span>
                  <div className="flex-1 h-px bg-ink-800" />
                </div>

                {/* Items grid */}
                <div className="grid sm:grid-cols-2 gap-3 ml-7">
                  {phase.items.map((item) => (
                    <div
                      key={item.title}
                      className={`bg-ink-800 border rounded-xl p-5 ${s.border} ${
                        phase.status === "shipped" ? "opacity-80" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-sm flex-shrink-0 ${
                          phase.status === "shipped" ? "text-lime" :
                          phase.status === "building" ? "text-violet-light" : "text-ink-600"
                        }`}>
                          {phase.status === "shipped" ? "✓" : phase.status === "building" ? "◈" : "○"}
                        </span>
                        <div>
                          <p className="font-display font-bold text-sm mb-1">{item.title}</p>
                          <p className="text-xs font-mono text-ink-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Suggest feature */}
      <section className="py-16 px-6 border-t border-ink-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-4">💡</div>
          <h2 className="text-2xl font-display font-bold mb-3">Have a feature request?</h2>
          <p className="text-ink-400 font-mono text-sm mb-8 leading-relaxed">
            We read every suggestion. Email us at{" "}
            <span className="text-lime">hello@beveez.tech</span> with the subject
            line "Feature Request" and we'll add it to our backlog.
          </p>
          <a
            href="mailto:hello@beveez.tech?subject=Feature Request"
            className="bg-lime text-ink-900 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-lime-dim transition-all inline-block"
          >
            Suggest a feature →
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
