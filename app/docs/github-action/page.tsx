import { PageLayout, PageHero } from "@/components/PageLayout";
import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Get your DocAI API key",
    desc: "Go to your dashboard → API Keys tab → create a new key. Copy it — you'll need it in step 2.",
    code: null,
    note: "API keys require the Team plan (₹3,999/mo).",
  },
  {
    n: "02",
    title: "Add secret to your GitHub repo",
    desc: "In your repository, go to Settings → Secrets and Variables → Actions → New repository secret.",
    code: `Name:  DOCAI_API_KEY
Value: dak_live_xxxxxxxxxxxxxxxxxxxx`,
    note: null,
  },
  {
    n: "03",
    title: "Create the workflow file",
    desc: "Create this file at .github/workflows/docai.yml in your repository:",
    code: `name: DocAI — Auto Documentation

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - "**.ts"
      - "**.tsx"
      - "**.js"
      - "**.py"
      - "**.php"
      - "**.go"
      - "**.rs"

jobs:
  generate-docs:
    name: Generate Documentation
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only origin/\${{ github.base_ref }}...HEAD \\
            | grep -E '\\.(ts|tsx|js|py|php|go|rs)$' | head -10)
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: Generate docs via DocAI
        if: steps.changed.outputs.files != ''
        env:
          DOCAI_API_KEY: \${{ secrets.DOCAI_API_KEY }}
        run: |
          mkdir -p docs/generated
          for FILE in \${{ steps.changed.outputs.files }}; do
            echo "Generating docs for: $FILE"
            CODE=$(cat "$FILE" | jq -Rs .)
            LANG=$(echo "$FILE" | sed 's/.*\\.//')
            RESPONSE=$(curl -s -X POST \\
              "https://docs.beveez.tech/api/generate-public" \\
              -H "Authorization: Bearer $DOCAI_API_KEY" \\
              -H "Content-Type: application/json" \\
              -d "{\\"code\\": $CODE, \\"language\\": \\"$LANG\\", \\"docType\\": \\"full\\"}")
            DOC=$(echo $RESPONSE | jq -r '.documentation')
            BASE=$(basename "$FILE" | sed 's/\\.[^.]*$//')
            echo "$DOC" > "docs/generated/\${BASE}.md"
          done

      - name: Commit generated docs
        if: steps.changed.outputs.files != ''
        run: |
          git config user.name "DocAI Bot"
          git config user.email "bot@docs.beveez.tech"
          git add docs/generated/
          git diff --staged --quiet || \\
            git commit -m "docs: auto-generate [DocAI]"
          git push

      - name: Comment on PR
        if: steps.changed.outputs.files != ''
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: \`📝 **DocAI** generated docs for changed files.
              Find them in \\\`docs/generated/\\\`.\`
            })`,
    note: null,
  },
  {
    n: "04",
    title: "Push a pull request",
    desc: "Open a PR that touches any .ts, .js, .py, .php, .go, or .rs file. The Action will automatically run and:",
    code: null,
    note: null,
    bullets: [
      "Generate docs for every changed file",
      "Commit them to docs/generated/ on your branch",
      "Comment on the PR with a confirmation",
    ],
  },
];

export default function GitHubActionPage() {
  return (
    <PageLayout>
      <PageHero
        badge="GitHub Action"
        title="Docs on every"
        highlight="pull request, automatically"
        subtitle="Set up once. Every PR touching your code files gets documentation generated and committed automatically — zero manual effort."
      />

      {/* Quick stats */}
      <div className="border-b border-ink-800 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { v: "< 5 min", l: "Setup time" },
            { v: "10 files", l: "Max per PR" },
            { v: "Free", l: "Action itself" },
          ].map(s => (
            <div key={s.l}>
              <p className="text-3xl font-display font-bold text-lime mb-1">{s.v}</p>
              <p className="text-xs font-mono text-ink-500 uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map(step => (
            <div key={step.n} className="flex gap-6">
              {/* Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lime/10 border border-lime/20 rounded-2xl flex items-center justify-center">
                  <span className="text-lg font-display font-bold text-lime">{step.n}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-display font-bold mb-2">{step.title}</h3>
                <p className="text-sm font-mono text-ink-400 leading-relaxed mb-4">{step.desc}</p>

                {step.bullets && (
                  <ul className="space-y-2 mb-4">
                    {step.bullets.map(b => (
                      <li key={b} className="flex items-center gap-2 text-sm font-mono text-ink-300">
                        <span className="text-lime text-xs">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                )}

                {step.code && (
                  <div className="bg-ink-800 border border-ink-700 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-ink-700 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                      </div>
                      <span className="text-xs font-mono text-ink-500">
                        {step.n === "03" ? ".github/workflows/docai.yml" : "GitHub secret"}
                      </span>
                    </div>
                    <pre className="text-xs font-mono text-lime/80 p-5 overflow-x-auto leading-relaxed max-h-96 overflow-y-auto">{step.code}</pre>
                  </div>
                )}

                {step.note && (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs font-mono text-yellow-400">
                      ⚠ {step.note}{" "}
                      <Link href="/pricing" className="underline">Upgrade here →</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customisation */}
      <section className="py-16 px-6 border-t border-ink-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-8">Customise the Action</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Change doc type", desc: "Replace \"full\" with \"readme\", \"api\", or \"inline\" to control what gets generated.", code: '"docType": "api"' },
              { title: "Limit file types", desc: "Edit the paths filter in the workflow to only run on specific extensions.", code: 'paths:\n  - "**.php"' },
              { title: "Skip auto-commit", desc: "Remove the commit step if you only want the PR comment, not the committed docs.", code: "# Remove commit step" },
              { title: "Change output folder", desc: "Replace docs/generated/ with any path in your repo.", code: "docs/api-reference/" },
            ].map(c => (
              <div key={c.title} className="bg-ink-800 border border-ink-700 rounded-xl p-5">
                <p className="font-display font-bold text-sm mb-2">{c.title}</p>
                <p className="text-xs font-mono text-ink-500 mb-3 leading-relaxed">{c.desc}</p>
                <code className="text-xs font-mono text-lime/75 bg-ink-900 px-3 py-1.5 rounded-lg block">{c.code}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-ink-800 text-center">
        <h2 className="text-2xl font-display font-bold mb-3">Ready to automate your docs?</h2>
        <p className="text-ink-400 font-mono text-sm mb-8">GitHub Action is included in the Team plan.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/pricing" className="bg-lime text-ink-900 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-lime-dim transition-all">
            Upgrade to Team →
          </Link>
          <Link href="/docs/api" className="border border-ink-600 text-ink-200 font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-lime/40 hover:text-lime transition-all">
            View API docs
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
