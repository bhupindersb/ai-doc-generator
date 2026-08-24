"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────
type Doc = { id: string; title: string; language: string; createdAt: Date };
type Tab = "generate" | "history" | "settings" | "apikeys";
type DocType = "full" | "readme" | "api" | "inline";

const PLAN_LIMITS: Record<string, number> = { FREE: 5, SOLO: 50, TEAM: 999999, ENTERPRISE: 999999 };
const PLAN_BADGE: Record<string, string> = {
  FREE:       "text-ink-400 bg-ink-700 border-ink-600",
  SOLO:       "text-violet-light bg-violet/10 border-violet/30",
  TEAM:       "text-lime bg-lime/10 border-lime/30",
  ENTERPRISE: "text-lime bg-lime/10 border-lime/30",
};

const LANGUAGES = ["typescript","javascript","python","php","go","rust","java","c++","c#","ruby","swift","kotlin","bash","sql","html","css","r","scala"];
const DOC_TYPES: { key: DocType; label: string; desc: string }[] = [
  { key: "full",   label: "Full Docs",  desc: "README + API + Inline" },
  { key: "readme", label: "README",     desc: "Project overview & setup" },
  { key: "api",    label: "API Ref",    desc: "Functions & parameters" },
  { key: "inline", label: "Inline",     desc: "Annotated source code" },
];
const NAV: { key: Tab; label: string; icon: string }[] = [
  { key: "generate", label: "Generate",  icon: "✦" },
  { key: "history",  label: "History",   icon: "◷" },
  { key: "settings", label: "Settings",  icon: "⚙" },
  { key: "apikeys",  label: "API Keys",  icon: "⌘" },
];

// ── Logo ───────────────────────────────────────────────────────────
const Logo = () => (
  <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#C8F135"/>
    <rect x="10" y="13" width="16" height="2.5" rx="1.25" fill="#0A0A0F"/>
    <rect x="10" y="19" width="24" height="2.5" rx="1.25" fill="#0A0A0F"/>
    <rect x="10" y="25" width="20" height="2.5" rx="1.25" fill="#0A0A0F"/>
    <circle cx="33" cy="13" r="4" fill="#0A0A0F"/>
    <path d="M31 13L32.5 14.5L35.5 11.5" stroke="#C8F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Main component ─────────────────────────────────────────────────
export function DashboardClient({ user, plan, docsThisMonth, recentDocs }: {
  user: { name: string; email: string; image: string | null };
  plan: string;
  docsThisMonth: number;
  recentDocs: Doc[];
}) {
  const [tab, setTab]             = useState<Tab>("generate");
  const [code, setCode]           = useState("");
  const [language, setLanguage]   = useState("typescript");
  const [docType, setDocType]     = useState<DocType>("full");
  const [output, setOutput]       = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const [viewRaw, setViewRaw]     = useState(false);
  const [search, setSearch]       = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  const limit    = PLAN_LIMITS[plan] ?? 5;
  const usagePct = limit === 999999 ? 0 : Math.min((docsThisMonth / limit) * 100, 100);
  const atLimit  = limit !== 999999 && docsThisMonth >= limit;
  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const filteredDocs = recentDocs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.language.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 480) + "px";
  }, [code]);

  async function generate() {
    if (!code.trim() || generating || atLimit) return;
    setGenerating(true); setError(null); setOutput(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, docType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setOutput(data.documentation);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    if (!output) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    a.download = `${language}-docs.md`; a.click();
  }

  // ── Sidebar ──────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-56 bg-ink-900 border-r border-ink-800 flex flex-col p-4
      transition-transform duration-200
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 px-1">
        <Logo />
        <span className="font-display font-bold text-lg">Doc<span className="text-lime">AI</span></span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(item => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left group ${
              tab === item.key
                ? "bg-lime/10 text-lime border border-lime/20"
                : "text-ink-400 hover:bg-ink-800 hover:text-ink-100"
            }`}
          >
            <span className="w-4 text-center text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="pt-3 mt-2 border-t border-ink-800">
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 hover:bg-ink-800 hover:text-lime transition-all"
          >
            <span className="w-4 text-center">↑</span>
            Upgrade plan
          </Link>
          <Link
            href="/docs/api"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500 hover:bg-ink-800 hover:text-lime transition-all"
          >
            <span className="w-4 text-center">?</span>
            API Docs
          </Link>
        </div>
      </nav>

      {/* Usage */}
      <div className="mb-4 bg-ink-800 border border-ink-700 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-ink-500">This month</span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full border font-bold ${PLAN_BADGE[plan] ?? PLAN_BADGE.FREE}`}>
            {plan}
          </span>
        </div>
        <p className="text-sm font-bold font-display mb-2">
          {docsThisMonth}<span className="text-ink-500 font-normal"> / {limit === 999999 ? "∞" : limit}</span>
        </p>
        {limit !== 999999 && (
          <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${usagePct}%`, background: usagePct > 80 ? "#ef4444" : "#C8F135" }}
            />
          </div>
        )}
        {atLimit && (
          <Link href="/pricing" className="block mt-2 text-xs font-mono text-lime hover:underline">
            Upgrade to continue →
          </Link>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 px-1">
        {user.image
          ? <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-ink-600 flex-shrink-0" />
          : <div className="w-8 h-8 rounded-full bg-violet/30 border border-violet/40 flex items-center justify-center text-xs font-bold text-violet-light flex-shrink-0">{initials}</div>
        }
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold font-display truncate">{user.name}</p>
          <p className="text-xs text-ink-500 font-mono truncate">{user.email}</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} title="Sign out" className="text-ink-600 hover:text-ink-200 transition-colors text-sm flex-shrink-0">⏻</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink-900/70 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar />

      {/* Main */}
      <div className="flex-1 md:ml-56 min-h-screen flex flex-col">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-ink-800 bg-ink-900 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-ink-400 hover:text-ink-100 text-lg">☰</button>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display font-bold">Doc<span className="text-lime">AI</span></span>
          </div>
          <div className="ml-auto">
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${PLAN_BADGE[plan] ?? PLAN_BADGE.FREE}`}>{plan}</span>
          </div>
        </div>

        {/* ── GENERATE TAB ── */}
        {tab === "generate" && (
          <div className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl w-full mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold mb-1">Generate Documentation</h1>
              <p className="text-sm font-mono text-ink-500">Paste your code · pick a type · get docs in seconds.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-mono flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">⚠</span>{error}
              </div>
            )}

            {/* Limit */}
            {atLimit && (
              <div className="mb-5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl px-4 py-3 text-sm font-mono flex items-center justify-between">
                <span>Monthly limit of {limit} docs reached.</span>
                <Link href="/pricing" className="font-bold underline hover:text-yellow-300">Upgrade →</Link>
              </div>
            )}

            {/* Editor grid */}
            <div className="flex-1 grid lg:grid-cols-2 gap-4 min-h-0">

              {/* ── Input pane ── */}
              <div className="bg-ink-800 border border-ink-700 rounded-2xl flex flex-col overflow-hidden">
                {/* Pane header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-700 bg-ink-900/50 flex-shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs font-mono text-ink-500 flex-1 ml-1">input.{language}</span>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="bg-ink-700 border border-ink-600 text-xs font-mono rounded-lg px-2 py-1 text-lime focus:outline-none focus:border-lime/50 cursor-pointer"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Doc type pills */}
                <div className="flex gap-1.5 px-4 py-2.5 border-b border-ink-700 bg-ink-800/50 flex-shrink-0 overflow-x-auto">
                  {DOC_TYPES.map(dt => (
                    <button
                      key={dt.key}
                      onClick={() => setDocType(dt.key)}
                      title={dt.desc}
                      className={`flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                        docType === dt.key
                          ? "bg-lime text-ink-900 font-bold"
                          : "bg-ink-700 text-ink-400 hover:bg-ink-600 hover:text-ink-100"
                      }`}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>

                {/* Code editor */}
                <div className="flex-1 relative flex min-h-[280px]">
                  {/* Line numbers */}
                  <div className="select-none flex-shrink-0 w-10 pt-4 pb-4 text-right pr-2 text-xs font-mono text-ink-700 leading-6 overflow-hidden bg-ink-900/30 border-r border-ink-700">
                    {(code || " ").split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        const s = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        const newCode = code.substring(0, s) + "  " + code.substring(end);
                        setCode(newCode);
                        setTimeout(() => { if (textareaRef.current) { textareaRef.current.selectionStart = textareaRef.current.selectionEnd = s + 2; } }, 0);
                      }
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate();
                    }}
                    placeholder={`// Paste your ${language} code here...\n// Tip: Press ⌘+Enter to generate`}
                    spellCheck={false}
                    className="flex-1 bg-transparent font-mono text-sm text-lime/85 placeholder-ink-700 p-4 resize-none focus:outline-none leading-6 min-h-[280px]"
                    style={{ tabSize: 2 }}
                  />
                  {/* Empty state overlay */}
                  {!code && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-4xl mb-3 opacity-20">{ "{}" }</div>
                      <p className="text-xs font-mono text-ink-700 opacity-60">Paste code to get started</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-ink-700 flex items-center justify-between flex-shrink-0">
                  <span className="text-xs font-mono text-ink-600">
                    {code ? `${code.split("\n").length} lines · ${code.length} chars` : "0 lines"}
                  </span>
                  <button
                    onClick={generate}
                    disabled={!code.trim() || generating || atLimit}
                    className="bg-lime text-ink-900 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-lime-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {generating
                      ? <><span className="w-3 h-3 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />Generating…</>
                      : <>Generate ✦ <span className="opacity-50 font-normal">⌘↵</span></>
                    }
                  </button>
                </div>
              </div>

              {/* ── Output pane ── */}
              <div className="bg-ink-800 border border-ink-700 rounded-2xl flex flex-col overflow-hidden">
                {/* Pane header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-700 bg-ink-900/50 flex-shrink-0">
                  <span className="text-xs font-mono text-ink-500 flex-1">output.md</span>
                  {output && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewRaw(!viewRaw)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-all ${viewRaw ? "bg-ink-600 text-ink-100" : "text-ink-500 hover:text-ink-200"}`}
                      >
                        {viewRaw ? "Preview" : "Raw"}
                      </button>
                      <button onClick={copy} className="text-xs font-mono bg-ink-700 hover:bg-ink-600 px-2.5 py-1 rounded-lg transition-all text-ink-300">
                        {copied ? "✓ Copied" : "Copy"}
                      </button>
                      <button onClick={download} className="text-xs font-mono bg-ink-700 hover:bg-ink-600 px-2.5 py-1 rounded-lg transition-all text-ink-300">
                        ↓ .md
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto min-h-[280px]">
                  {generating && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border-2 border-lime/20 rounded-full" />
                        <div className="absolute inset-0 border-2 border-lime border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-xs font-mono text-ink-500 animate-pulse2">Claude is reading your code…</p>
                    </div>
                  )}
                  {!generating && !output && (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-16 text-center px-8">
                      <div className="w-12 h-12 bg-ink-700 rounded-2xl flex items-center justify-center text-2xl mb-1">📝</div>
                      <p className="text-sm font-display font-bold text-ink-400">Your docs will appear here</p>
                      <p className="text-xs font-mono text-ink-600 leading-relaxed max-w-xs">
                        Paste code on the left, pick a doc type, then hit Generate or press ⌘+Enter
                      </p>
                    </div>
                  )}
                  {!generating && output && (
                    <div className="p-5">
                      {viewRaw
                        ? <pre className="text-xs font-mono text-ink-300 whitespace-pre-wrap leading-relaxed">{output}</pre>
                        : <SimpleMarkdown content={output} />
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "💡", tip: "Select Full Docs for README + API + Inline in one shot" },
                { icon: "⚡", tip: "Press ⌘+Enter to generate without reaching for the mouse" },
                { icon: "🔗", tip: "Team plan auto-generates docs on every GitHub PR via Action" },
              ].map(t => (
                <div key={t.tip} className="bg-ink-800 border border-ink-700 rounded-xl px-4 py-3 text-xs font-mono text-ink-500 flex items-start gap-2">
                  <span className="flex-shrink-0">{t.icon}</span><span>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="p-4 md:p-8 max-w-3xl w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold mb-1">History</h1>
              <p className="text-sm font-mono text-ink-500">All your generated documents.</p>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 text-sm">⌕</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or language…"
                className="w-full bg-ink-800 border border-ink-700 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-ink-100 placeholder-ink-600 focus:outline-none focus:border-lime/40 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-200 transition-colors text-xs">✕</button>
              )}
            </div>

            {/* Results */}
            {filteredDocs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-ink-700 rounded-2xl">
                {recentDocs.length === 0 ? (
                  <>
                    <div className="text-4xl mb-4">📭</div>
                    <p className="font-display font-bold text-ink-400 mb-2">No documents yet</p>
                    <p className="text-xs font-mono text-ink-600 mb-6">Generate your first doc to see it appear here.</p>
                    <button
                      onClick={() => setTab("generate")}
                      className="bg-lime text-ink-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-lime-dim transition-all"
                    >
                      Generate first doc →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-3">🔍</div>
                    <p className="text-sm font-mono text-ink-500">No results for "{search}"</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="bg-ink-800 border border-ink-700 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-ink-500 transition-all group">
                    <div className="w-9 h-9 bg-ink-700 border border-ink-600 rounded-xl flex items-center justify-center text-base flex-shrink-0 group-hover:border-lime/30 transition-all">📄</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm font-display truncate">{doc.title}</p>
                      <p className="text-xs text-ink-500 font-mono mt-0.5">
                        {new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-xs bg-ink-700 border border-ink-600 px-2.5 py-1 rounded-lg font-mono text-lime flex-shrink-0">
                      {doc.language}
                    </span>
                  </div>
                ))}
                <p className="text-xs font-mono text-ink-600 text-center pt-2">
                  Showing {filteredDocs.length} of {recentDocs.length} documents
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="p-4 md:p-8 max-w-2xl w-full space-y-5">
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold mb-1">Settings</h1>
              <p className="text-sm font-mono text-ink-500">Manage your account and subscription.</p>
            </div>

            {/* Profile */}
            <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
              <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-5">Profile</p>
              <div className="flex items-center gap-5">
                {user.image
                  ? <img src={user.image} alt="" className="w-16 h-16 rounded-full border-2 border-ink-600" />
                  : <div className="w-16 h-16 rounded-full bg-violet/25 border-2 border-violet/35 flex items-center justify-center text-xl font-bold text-violet-light">{initials}</div>
                }
                <div>
                  <p className="font-bold font-display text-lg">{user.name}</p>
                  <p className="text-sm font-mono text-ink-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-ink-500">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span className="text-xs font-mono text-ink-500">Connected via GitHub</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
              <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-5">Subscription</p>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-bold font-mono px-3 py-1 rounded-full border ${PLAN_BADGE[plan] ?? PLAN_BADGE.FREE}`}>{plan} PLAN</span>
                  </div>
                  <p className="text-sm font-mono text-ink-400">
                    {limit === 999999 ? "Unlimited docs per month" : `${docsThisMonth} of ${limit} docs used this month`}
                  </p>
                  {plan !== "FREE" && <p className="text-xs font-mono text-ink-600 mt-1">Renews on 1st of next month · Cancel anytime</p>}
                </div>
                {plan === "FREE"
                  ? <Link href="/pricing" className="bg-lime text-ink-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-lime-dim transition-all flex-shrink-0">Upgrade</Link>
                  : <button className="border border-red-500/30 text-red-400 font-mono text-xs px-4 py-2 rounded-lg hover:border-red-500/50 transition-all flex-shrink-0">Cancel plan</button>
                }
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
              <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-5">Preferences</p>
              <div className="space-y-4">
                {[
                  { label: "Email on generation complete", sub: "Get notified when long docs finish" },
                  { label: "Weekly usage digest", sub: "Summary of your usage every Monday" },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-display font-medium">{pref.label}</p>
                      <p className="text-xs font-mono text-ink-500">{pref.sub}</p>
                    </div>
                    <div className="w-10 h-5 bg-ink-700 border border-ink-600 rounded-full cursor-pointer relative flex-shrink-0">
                      <div className="w-3.5 h-3.5 bg-ink-400 rounded-full absolute top-0.5 left-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <p className="text-xs font-mono text-red-400 uppercase tracking-wider mb-4">Account</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-display font-medium">Sign out</p>
                  <p className="text-xs font-mono text-ink-500">You'll need to sign back in with GitHub.</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border border-red-500/30 text-red-400 font-mono text-xs px-4 py-2 rounded-lg hover:border-red-500/50 transition-all"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── API KEYS TAB ── */}
        {tab === "apikeys" && (
          <div className="p-4 md:p-8 max-w-2xl w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold mb-1">API Keys</h1>
              <p className="text-sm font-mono text-ink-500">Use DocAI programmatically from your own tools.</p>
            </div>

            {/* Locked for free */}
            {plan === "FREE" ? (
              <div className="bg-ink-800 border border-ink-700 rounded-2xl p-10 text-center">
                <div className="text-4xl mb-4">🔑</div>
                <p className="font-display font-bold text-lg mb-2">API access on Team plan</p>
                <p className="text-sm font-mono text-ink-500 mb-6 max-w-sm mx-auto leading-relaxed">
                  Generate documentation from your own scripts, CI pipelines, or IDE plugins.
                </p>
                <Link href="/pricing" className="bg-lime text-ink-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-lime-dim transition-all">
                  Upgrade to Team →
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-xs font-mono text-ink-500 uppercase tracking-wider">Your API Keys</p>
                    <button className="bg-lime text-ink-900 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-lime-dim transition-all">+ New Key</button>
                  </div>
                  <div className="space-y-3">
                    {[{ name: "Production", key: "dak_live_••••••••••••3f2a", created: "1 Jun 2026" }].map(k => (
                      <div key={k.name} className="flex items-center gap-4 bg-ink-900 border border-ink-700 rounded-xl px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-display font-bold">{k.name}</p>
                          <p className="text-xs font-mono text-ink-500 mt-0.5">{k.key} · Created {k.created}</p>
                        </div>
                        <button className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex-shrink-0">Revoke</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-ink-800 border border-ink-700 rounded-2xl p-6">
                  <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-4">Quick Start</p>
                  <pre className="text-xs font-mono text-lime/80 bg-ink-900 rounded-xl p-4 overflow-x-auto leading-relaxed">{`curl -X POST https://docs.beveez.tech/api/generate-public \\
  -H "Authorization: Bearer dak_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "your code here",
    "language": "php",
    "docType": "full"
  }'`}</pre>
                  <Link href="/docs/api" className="inline-block mt-3 text-xs font-mono text-lime hover:underline">
                    View full API docs →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Simple Markdown renderer ───────────────────────────────────────
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="prose-dark space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("# "))  return <h1 key={i}>{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
        if (line.startsWith("### "))return <h3 key={i}>{line.slice(4)}</h3>;
        if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i}>{line.slice(2)}</li>;
        if (line.startsWith("```")) return <div key={i} className="text-xs font-mono text-lime/60 bg-ink-900 rounded px-2 py-0.5">{line}</div>;
        if (line === "") return <div key={i} className="h-2" />;
        if (line.startsWith("---")) return <hr key={i} className="border-ink-700 my-2" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
