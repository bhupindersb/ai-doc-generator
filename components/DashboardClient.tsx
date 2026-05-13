// components/DashboardClient.tsx
"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { CodeUploader } from "./CodeUploader";
import { DocPreview } from "./DocPreview";

type Doc = {
  id: string;
  title: string;
  language: string;
  createdAt: Date;
};

type Props = {
  user: { name: string; email: string; image: string | null };
  plan: string;
  docsThisMonth: number;
  recentDocs: Doc[];
};

const PLAN_LIMITS: Record<string, number> = {
  FREE: 5,
  SOLO: 50,
  TEAM: 999999,
  ENTERPRISE: 999999,
};

export function DashboardClient({ user, plan, docsThisMonth, recentDocs }: Props) {
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = PLAN_LIMITS[plan] ?? 5;
  const usagePct = limit === 999999 ? 0 : Math.min((docsThisMonth / limit) * 100, 100);
  const isAtLimit = limit !== 999999 && docsThisMonth >= limit;

  async function handleGenerate(code: string, language: string, docType: string) {
    if (isAtLimit) {
      setError("You've reached your monthly limit. Please upgrade your plan.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setGeneratedDoc(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, docType }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }
      const data = await res.json();
      setGeneratedDoc(data.documentation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-ink-800 flex flex-col p-6 fixed h-full">
        <Link href="/" className="font-display font-bold text-xl mb-10 block">
          Doc<span className="text-lime">AI</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {[
            { key: "generate", label: "Generate Docs", icon: "✦" },
            { key: "history", label: "History", icon: "◷" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === item.key
                  ? "bg-lime/10 text-lime border border-lime/20"
                  : "text-ink-200 hover:bg-ink-800 hover:text-ink-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-ink-800 mt-4">
            <Link
              href="/#pricing"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-200 hover:bg-ink-800 hover:text-ink-100 transition-all"
            >
              <span>↑</span> Upgrade Plan
            </Link>
          </div>
        </nav>

        {/* Usage meter */}
        <div className="mt-auto">
          <div className="bg-ink-800 border border-ink-600 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-ink-400">Usage this month</span>
              <span className="text-xs font-bold text-lime font-mono">
                {plan}
              </span>
            </div>
            <div className="text-sm font-bold mb-2">
              {docsThisMonth} / {limit === 999999 ? "∞" : limit} docs
            </div>
            {limit !== 999999 && (
              <div className="h-1.5 bg-ink-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime rounded-full transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            {user.image && (
              <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-ink-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-ink-400 hover:text-ink-100 transition-colors text-xs"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {activeTab === "generate" && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold mb-1">Generate Documentation</h1>
              <p className="text-ink-400">Paste your code and get complete docs in seconds.</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {isAtLimit && (
              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
                <span>You've hit your monthly limit of {limit} docs.</span>
                <Link href="/#pricing" className="font-bold underline">Upgrade →</Link>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <CodeUploader onGenerate={handleGenerate} isGenerating={isGenerating} disabled={isAtLimit} />
              <DocPreview documentation={generatedDoc} isGenerating={isGenerating} />
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold mb-1">History</h1>
              <p className="text-ink-400">Your recently generated documents.</p>
            </div>

            {recentDocs.length === 0 ? (
              <div className="text-center py-16 text-ink-400">
                <p className="text-4xl mb-4">📭</p>
                <p>No documents yet. Generate your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-ink-800 border border-ink-600 rounded-xl px-5 py-4 flex items-center justify-between hover:border-ink-400 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-sm">{doc.title}</p>
                      <p className="text-xs text-ink-400 font-mono mt-0.5">
                        {doc.language} · {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-ink-700 px-2 py-1 rounded font-mono text-lime">
                      {doc.language}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
