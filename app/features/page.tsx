import { PageLayout, PageHero } from "@/components/PageLayout";
import Link from "next/link";

const features = [
  {
    icon: "📄", title: "README Generator",
    desc: "Instantly produce a professional README.md from any codebase — including project overview, installation steps, environment variables, usage examples, and badges. Never write a README from scratch again.",
    bullets: ["Auto-detects project type (library, API, CLI, web app)", "Generates badges (version, license, CI status)", "Includes code examples pulled from your own code"],
    color: "#C8F135",
  },
  {
    icon: "🔍", title: "API Reference",
    desc: "Document every function, class, and method with parameter types, return values, and real usage examples. Output is structured Markdown that you can drop directly into your docs site.",
    bullets: ["Auto-detects TypeScript types, Python hints, PHPDoc", "Generates working code examples for each function", "Exports as Markdown, HTML, or plain text"],
    color: "#a78bfa",
  },
  {
    icon: "💬", title: "Inline Comments",
    desc: "Returns your code annotated with JSDoc, docstrings, or language-native comment format — with every function, parameter, and complex logic block explained in plain English.",
    bullets: ["Respects existing comments — adds to, doesn't replace", "Follows JSDoc, PHPDoc, PyDoc, GoDoc conventions", "Works on files up to 2,000 lines"],
    color: "#C8F135",
  },
  {
    icon: "⚙️", title: "GitHub Action",
    desc: "Add a single YAML file to your repo and DocAI will auto-generate documentation for every changed file on every pull request — committing the docs back as a separate commit.",
    bullets: ["Setup takes under 5 minutes", "Works on any GitHub repository", "PRs get a comment with the docs preview link"],
    color: "#a78bfa",
  },
  {
    icon: "🌐", title: "20+ Languages",
    desc: "Full support for every major language — with language-specific conventions, comment formats, and type annotation styles respected in every generated doc.",
    bullets: ["TypeScript, JavaScript, Python, PHP, Go, Rust, Java", "C++, C#, Ruby, Swift, Kotlin, Bash, SQL, HTML, CSS", "R, Scala, Elixir support in beta"],
    color: "#C8F135",
  },
  {
    icon: "⬇️", title: "Flexible Export",
    desc: "Copy to clipboard, download as .md, or use the API to push docs directly to your repo, Confluence, Notion, or any other documentation platform.",
    bullets: ["One-click Markdown download", "REST API for CI/CD pipeline integration", "Notion and Confluence export coming Q3 2026"],
    color: "#a78bfa",
  },
];

export default function FeaturesPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Features"
        title="Everything your team"
        highlight="needs to ship docs fast"
        subtitle="Six core features that cover the full documentation lifecycle — from first commit to published API reference."
      />

      {/* Feature deep-dives */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-20">
          {features.map((f, i) => (
            <div key={f.title} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              {/* Text */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  {f.icon}
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">{f.title}</h2>
                <p className="text-ink-400 font-mono text-sm leading-relaxed mb-6">{f.desc}</p>
                <ul className="space-y-2.5">
                  {f.bullets.map(b => (
                    <li key={b} className="flex items-start gap-3 text-sm font-mono text-ink-300">
                      <span className="text-lime mt-0.5 flex-shrink-0">✓</span>{b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual card */}
              <div className={`bg-ink-800 border border-ink-700 rounded-2xl p-6 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs font-mono text-ink-500">docai — {f.title.toLowerCase()}</span>
                </div>
                <div className="bg-ink-900 rounded-xl p-4 font-mono text-xs leading-relaxed" style={{ color: `${f.color}CC` }}>
                  {f.title === "README Generator" && `# MyProject\n\n[![version](https://img.shields.io/badge/v2.1.0-lime)]\n\n## Installation\n\`\`\`bash\nnpm install myproject\n\`\`\`\n\n## Usage\n\`\`\`js\nimport { create } from 'myproject';\ncreate({ name: 'hello' });\n\`\`\``}
                  {f.title === "API Reference" && `## createUser(data)\n\nCreates a new user record.\n\n**Parameters**\n- \`data.name\` string — Full name\n- \`data.email\` string — Email address\n- \`data.role\` 'admin'|'user'\n\n**Returns** Promise<User>\n\n\`\`\`ts\nconst user = await createUser({\n  name: 'Bhupinder',\n  email: 'b@beveez.tech',\n  role: 'admin'\n});\n\`\`\``}
                  {f.title === "Inline Comments" && `/**\n * Calculates the discounted price.\n *\n * @param {number} price - Original price in INR\n * @param {string} tier - User tier: 'solo'|'team'\n * @returns {number} Final price after discount\n */\nfunction applyDiscount(price, tier) {\n  const rates = { solo: 0.1, team: 0.25 };\n  return price * (1 - (rates[tier] ?? 0));\n}`}
                  {f.title === "GitHub Action" && `# .github/workflows/docs.yml\nname: DocAI\non:\n  pull_request:\n    paths: ['**.ts','**.py','**.php']\njobs:\n  generate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Generate docs\n        uses: beveez/docai-action@v1\n        with:\n          api_key: \${{ secrets.DOCAI_KEY }}`}
                  {f.title === "20+ Languages" && `// TypeScript ✓\nfunction add(a: number, b: number): number\n\n# Python ✓\ndef add(a: int, b: int) -> int:\n\n<?php // PHP ✓\nfunction add(int $a, int $b): int\n\n// Go ✓\nfunc Add(a, b int) int\n\n// Rust ✓\npub fn add(a: i32, b: i32) -> i32`}
                  {f.title === "Flexible Export" && `# Export options\n\n## 1. Download\ncurl -O docs.beveez.tech/export/readme.md\n\n## 2. API\ncurl -X POST /api/generate-public \\\n  -H "Authorization: Bearer dak_..."\n\n## 3. GitHub commit\n✓ Committed to docs/generated/\n  on branch: feature/auth-module`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-ink-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to try it?</h2>
          <p className="text-ink-400 font-mono text-sm mb-8">Free tier — 5 docs per month. No credit card required.</p>
          <Link href="/dashboard" className="bg-lime text-ink-900 font-bold px-8 py-4 rounded-xl text-sm hover:bg-lime-dim transition-all hover:scale-[1.03] lime-glow inline-block">
            Start generating for free →
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
