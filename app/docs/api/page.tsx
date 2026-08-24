import { PageLayout, PageHero } from "@/components/PageLayout";
import Link from "next/link";

const endpoints = [
  {
    method: "POST",
    path: "/api/generate-public",
    desc: "Generate documentation for a code snippet.",
    auth: true,
    body: [
      { field: "code",     type: "string",                              req: true,  desc: "The source code to document." },
      { field: "language", type: "string",                              req: true,  desc: "Programming language (e.g. typescript, php, python)." },
      { field: "docType",  type: "'full'|'readme'|'api'|'inline'",      req: false, desc: "Type of documentation to generate. Defaults to 'full'." },
    ],
    response: `{
  "documentation": "## myFunction()\\n\\nGenerates...",
  "tokensUsed": 1240,
  "language": "typescript",
  "docType": "full"
}`,
  },
  {
    method: "GET",
    path: "/api/usage",
    desc: "Get your current usage for the billing period.",
    auth: true,
    body: [],
    response: `{
  "plan": "SOLO",
  "docsThisMonth": 12,
  "limit": 50,
  "resetDate": "2026-09-01T00:00:00Z"
}`,
  },
];

const languages = [
  "typescript","javascript","python","php","go","rust",
  "java","c++","c#","ruby","swift","kotlin","bash","sql","html","css","r","scala",
];

export default function ApiDocsPage() {
  return (
    <PageLayout>
      <PageHero
        badge="API Reference"
        title="Integrate DocAI"
        highlight="into anything"
        subtitle="A simple REST API to generate documentation from your own scripts, pipelines, and IDE plugins. Available on the Team plan."
      />

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* Sidebar nav */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              {["Authentication", "Base URL", "Endpoints", "Languages", "Errors", "Rate limits"].map(s => (
                <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`}
                  className="block text-sm font-mono text-ink-500 hover:text-lime transition-colors py-1">
                  {s}
                </a>
              ))}
              <div className="pt-4 border-t border-ink-800 mt-4">
                <Link href="/pricing" className="text-xs font-mono text-lime hover:underline">
                  Get API access →
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-16">

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-xl font-display font-bold mb-4">Authentication</h2>
              <p className="text-ink-400 font-mono text-sm leading-relaxed mb-4">
                All API requests require a Bearer token in the Authorization header. Generate API keys from your{" "}
                <Link href="/dashboard" className="text-lime hover:underline">dashboard → API Keys</Link>.
              </p>
              <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
                <pre className="text-xs font-mono text-lime/80 leading-relaxed">{`Authorization: Bearer dak_live_xxxxxxxxxxxxxxxxxxxx`}</pre>
              </div>
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                <p className="text-xs font-mono text-yellow-400">⚠ API access requires the Team plan (₹3,999/mo). <Link href="/pricing" className="underline">Upgrade here →</Link></p>
              </div>
            </section>

            {/* Base URL */}
            <section id="base-url">
              <h2 className="text-xl font-display font-bold mb-4">Base URL</h2>
              <div className="bg-ink-800 border border-ink-700 rounded-xl p-4">
                <pre className="text-xs font-mono text-lime/80">{`https://docs.beveez.tech`}</pre>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-xl font-display font-bold mb-8">Endpoints</h2>
              <div className="space-y-10">
                {endpoints.map(ep => (
                  <div key={ep.path} className="bg-ink-800 border border-ink-700 rounded-2xl overflow-hidden">
                    {/* Endpoint header */}
                    <div className="px-5 py-4 border-b border-ink-700 flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                        ep.method === "POST" ? "bg-lime/15 text-lime border border-lime/25" : "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                      }`}>{ep.method}</span>
                      <code className="text-sm font-mono text-ink-100">{ep.path}</code>
                      {ep.auth && <span className="ml-auto text-xs font-mono text-ink-500 bg-ink-700 px-2 py-0.5 rounded">Auth required</span>}
                    </div>
                    <div className="p-5 space-y-5">
                      <p className="text-sm font-mono text-ink-400">{ep.desc}</p>

                      {/* Request body */}
                      {ep.body.length > 0 && (
                        <div>
                          <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-3">Request body (JSON)</p>
                          <div className="space-y-2">
                            {ep.body.map(field => (
                              <div key={field.field} className="flex items-start gap-3 bg-ink-900 rounded-xl px-4 py-3">
                                <code className="text-xs font-mono text-lime flex-shrink-0 w-20">{field.field}</code>
                                <code className="text-xs font-mono text-violet-light flex-shrink-0 hidden sm:block">{field.type}</code>
                                <span className={`text-xs font-mono flex-shrink-0 ${field.req ? "text-red-400" : "text-ink-600"}`}>{field.req ? "required" : "optional"}</span>
                                <span className="text-xs font-mono text-ink-500">{field.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Example */}
                      <div>
                        <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-3">Example request</p>
                        <pre className="text-xs font-mono text-lime/75 bg-ink-900 border border-ink-700 rounded-xl p-4 overflow-x-auto leading-relaxed">{
                          ep.method === "POST"
                            ? `curl -X POST https://docs.beveez.tech${ep.path} \\
  -H "Authorization: Bearer dak_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript",
    "docType": "full"
  }'`
                            : `curl https://docs.beveez.tech${ep.path} \\
  -H "Authorization: Bearer dak_live_..."`
                        }</pre>
                      </div>

                      {/* Response */}
                      <div>
                        <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-3">Response</p>
                        <pre className="text-xs font-mono text-violet-light/80 bg-ink-900 border border-ink-700 rounded-xl p-4 overflow-x-auto leading-relaxed">{ep.response}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section id="languages">
              <h2 className="text-xl font-display font-bold mb-4">Supported languages</h2>
              <p className="text-sm font-mono text-ink-400 mb-5">Pass the language as a lowercase string.</p>
              <div className="flex flex-wrap gap-2">
                {languages.map(l => (
                  <code key={l} className="text-xs font-mono bg-ink-800 border border-ink-700 text-lime/80 px-3 py-1.5 rounded-lg">{l}</code>
                ))}
              </div>
            </section>

            {/* Errors */}
            <section id="errors">
              <h2 className="text-xl font-display font-bold mb-5">Error codes</h2>
              <div className="bg-ink-800 border border-ink-700 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-ink-700">
                    <th className="text-left px-5 py-3 text-xs font-mono text-ink-500">Code</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-ink-500">Meaning</th>
                  </tr></thead>
                  <tbody className="divide-y divide-ink-700">
                    {[
                      ["401", "Missing or invalid API key."],
                      ["403", "Your plan does not include API access."],
                      ["429", "Monthly doc limit reached. Upgrade or wait for reset."],
                      ["400", "Invalid request body — check required fields."],
                      ["500", "Internal error — retry after a few seconds."],
                    ].map(([code, msg]) => (
                      <tr key={code}>
                        <td className="px-5 py-3 font-mono text-xs text-red-400">{code}</td>
                        <td className="px-5 py-3 font-mono text-xs text-ink-400">{msg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rate limits */}
            <section id="rate-limits">
              <h2 className="text-xl font-display font-bold mb-4">Rate limits</h2>
              <div className="bg-ink-800 border border-ink-700 rounded-2xl p-5 space-y-3">
                {[
                  ["Team plan", "60 requests / minute"],
                  ["Enterprise", "Custom — contact us"],
                ].map(([plan, limit]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <span className="text-sm font-mono text-ink-300">{plan}</span>
                    <span className="text-sm font-mono text-lime">{limit}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-mono text-ink-600 mt-3">Rate limit headers are included in every response: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.</p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
