import { PageLayout, PageHero } from "@/components/PageLayout";
import Link from "next/link";

const integrations = [
  {
    category: "Version Control",
    items: [
      { name: "GitHub", icon: "GH", status: "live", desc: "Sign in with GitHub, auto-generate docs on PRs via GitHub Action, push docs to any branch.", plan: "All plans" },
      { name: "GitLab", icon: "GL", status: "planned", desc: "GitLab OAuth and CI/CD pipeline integration coming Q4 2026.", plan: "Coming Q4" },
      { name: "Bitbucket", icon: "BB", status: "planned", desc: "Bitbucket Pipelines integration on the roadmap for 2027.", plan: "2027" },
    ],
  },
  {
    category: "Documentation Platforms",
    items: [
      { name: "Markdown", icon: "MD", status: "live", desc: "Download any generated doc as a .md file instantly. Works with any platform that accepts Markdown.", plan: "All plans" },
      { name: "Notion", icon: "N", status: "building", desc: "Push generated docs directly to any Notion page or database. Currently in development.", plan: "Coming Q3" },
      { name: "Confluence", icon: "CF", status: "building", desc: "Publish directly to Confluence spaces. In development for Team and Enterprise plans.", plan: "Coming Q3" },
      { name: "Readme.io", icon: "R", status: "planned", desc: "Direct integration with Readme.io for beautiful hosted API documentation.", plan: "Coming Q4" },
    ],
  },
  {
    category: "Editors & IDEs",
    items: [
      { name: "VS Code", icon: "VS", status: "planned", desc: "Generate docs for any function or file without leaving your editor. Extension in development.", plan: "Coming Q4" },
      { name: "JetBrains", icon: "JB", status: "planned", desc: "PhpStorm, IntelliJ, PyCharm, and GoLand plugin coming Q4 2026.", plan: "Coming Q4" },
      { name: "Neovim", icon: "NV", status: "future", desc: "Community-maintained Neovim plugin. Contributions welcome.", plan: "2027" },
    ],
  },
  {
    category: "CI/CD & DevOps",
    items: [
      { name: "GitHub Actions", icon: "GA", status: "live", desc: "Plug-and-play YAML workflow that generates docs on every PR. Full guide available.", plan: "Team plan" },
      { name: "REST API", icon: "API", status: "live", desc: "Call the DocAI API from any CI pipeline, script, or automation tool. Full API docs available.", plan: "Team plan" },
      { name: "GitLab CI", icon: "CI", status: "planned", desc: "Native GitLab CI job definition for auto-documentation.", plan: "Coming Q4" },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  live:     { label: "Live",     color: "text-lime bg-lime/10 border-lime/25",           dot: "bg-lime" },
  building: { label: "Building", color: "text-violet-light bg-violet/10 border-violet/25", dot: "bg-violet animate-pulse2" },
  planned:  { label: "Planned",  color: "text-ink-400 bg-ink-700 border-ink-600",         dot: "bg-ink-500" },
  future:   { label: "Future",   color: "text-ink-600 bg-ink-800 border-ink-700",         dot: "bg-ink-700" },
};

export default function IntegrationsPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Integrations"
        title="DocAI works with"
        highlight="your whole stack"
        subtitle="Connect DocAI to the tools your team already uses — from your editor to your CI pipeline to your documentation platform."
      />

      {/* Filter legend */}
      <div className="border-b border-ink-800 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 justify-center">
          {Object.entries(statusConfig).map(([key, s]) => (
            <div key={key} className={`inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border ${s.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Integration categories */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {integrations.map(cat => (
            <div key={cat.category}>
              <h2 className="text-lg font-display font-bold mb-6 text-ink-200">{cat.category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map(item => {
                  const s = statusConfig[item.status];
                  return (
                    <div
                      key={item.name}
                      className={`bg-ink-800 border border-ink-700 rounded-2xl p-5 flex flex-col ${
                        item.status === "live" ? "hover:border-lime/25 transition-all" : "opacity-70"
                      }`}
                    >
                      {/* Icon + status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-ink-700 border border-ink-600 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-ink-300">
                          {item.icon}
                        </div>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${s.color}`}>
                          <span className={`w-1 h-1 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm mb-2">{item.name}</h3>
                      <p className="text-xs font-mono text-ink-500 leading-relaxed flex-1 mb-4">{item.desc}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-ink-600">{item.plan}</span>
                        {item.status === "live" && (
                          <Link
                            href={item.name === "GitHub Actions" ? "/docs/github-action" : item.name === "REST API" ? "/docs/api" : "#"}
                            className="text-xs font-mono text-lime hover:underline"
                          >
                            View docs →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Request integration */}
      <section className="py-16 px-6 border-t border-ink-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-4">🔌</div>
          <h2 className="text-2xl font-display font-bold mb-3">Need a specific integration?</h2>
          <p className="text-ink-400 font-mono text-sm mb-8 leading-relaxed">
            Email <span className="text-lime">hello@beveez.tech</span> and tell us what tool you want DocAI to connect with.
            High-demand requests get prioritised.
          </p>
          <a
            href="mailto:hello@beveez.tech?subject=Integration Request"
            className="bg-lime text-ink-900 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-lime-dim transition-all inline-block"
          >
            Request an integration →
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
