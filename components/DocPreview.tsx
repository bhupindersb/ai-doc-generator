// components/DocPreview.tsx
"use client";
import { useState } from "react";

type Props = {
  documentation: string | null;
  isGenerating: boolean;
};

export function DocPreview({ documentation, isGenerating }: Props) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");

  async function handleCopy() {
    if (!documentation) return;
    await navigator.clipboard.writeText(documentation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!documentation) return;
    const blob = new Blob([documentation], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documentation.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-600 flex items-center justify-between">
        <h2 className="font-display font-bold text-sm">Generated Documentation</h2>
        <div className="flex items-center gap-2">
          {documentation && (
            <>
              <div className="flex bg-ink-700 rounded-lg p-0.5">
                {(["preview", "raw"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all capitalize ${
                      viewMode === m ? "bg-ink-500 text-lime" : "text-ink-400"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="text-xs bg-ink-700 hover:bg-ink-600 px-2.5 py-1.5 rounded-lg transition-all text-ink-200"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="text-xs bg-ink-700 hover:bg-ink-600 px-2.5 py-1.5 rounded-lg transition-all text-ink-200"
              >
                ↓ .md
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-[380px]">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-lime/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-lime border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-ink-400 text-sm font-mono animate-pulse2">
              Claude is reading your code...
            </p>
          </div>
        )}

        {!isGenerating && !documentation && (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
            <div className="text-4xl">📝</div>
            <p className="text-ink-400 text-sm">
              Your documentation will appear here.
            </p>
            <p className="text-ink-600 text-xs font-mono">
              Paste code → Select type → Click Generate
            </p>
          </div>
        )}

        {!isGenerating && documentation && (
          <div className="p-5">
            {viewMode === "raw" ? (
              <pre className="text-xs font-mono text-ink-200 whitespace-pre-wrap leading-relaxed">
                {documentation}
              </pre>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none">
                <MarkdownRenderer content={documentation} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Simple markdown renderer (avoids heavy dependencies)
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm text-ink-100 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("# "))
          return <h1 key={i} className="text-2xl font-display font-bold text-white mt-4 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith("## "))
          return <h2 key={i} className="text-lg font-display font-bold text-lime mt-4 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith("### "))
          return <h3 key={i} className="text-base font-bold text-violet-light mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("```"))
          return <div key={i} className="font-mono text-xs text-lime/70 bg-ink-900 rounded px-3 py-0.5 my-1">{line}</div>;
        if (line.startsWith("- "))
          return <li key={i} className="ml-4 text-ink-200 list-disc">{line.slice(2)}</li>;
        if (line.startsWith("**") && line.endsWith("**"))
          return <p key={i} className="font-bold text-white">{line.slice(2, -2)}</p>;
        if (line === "")
          return <div key={i} className="h-1" />;
        return <p key={i} className="text-ink-200">{line}</p>;
      })}
    </div>
  );
}
