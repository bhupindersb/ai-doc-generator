// components/CodeUploader.tsx
"use client";
import { useState } from "react";

const LANGUAGES = [
  "typescript", "javascript", "python", "go", "rust",
  "java", "c++", "c#", "php", "ruby", "swift", "kotlin",
  "bash", "sql", "html", "css",
];

const DOC_TYPES = [
  { key: "full", label: "Full Docs", desc: "README + API + Inline" },
  { key: "readme", label: "README", desc: "Project overview & setup" },
  { key: "api", label: "API Reference", desc: "Functions & parameters" },
  { key: "inline", label: "Inline Comments", desc: "Annotated code" },
];

type Props = {
  onGenerate: (code: string, language: string, docType: string) => void;
  isGenerating: boolean;
  disabled: boolean;
};

export function CodeUploader({ onGenerate, isGenerating, disabled }: Props) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [docType, setDocType] = useState("full");

  function handleSubmit() {
    if (!code.trim()) return;
    onGenerate(code, language, docType);
  }

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-600 flex items-center justify-between">
        <h2 className="font-display font-bold text-sm">Your Code</h2>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-ink-700 border border-ink-600 text-xs font-mono rounded-lg px-2 py-1.5 text-ink-100 focus:outline-none focus:border-lime/50"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doc type selector */}
      <div className="px-5 py-3 border-b border-ink-600 flex gap-2 overflow-x-auto">
        {DOC_TYPES.map((dt) => (
          <button
            key={dt.key}
            onClick={() => setDocType(dt.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              docType === dt.key
                ? "bg-lime text-ink-900"
                : "bg-ink-700 text-ink-200 hover:bg-ink-600"
            }`}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {/* Code textarea */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`// Paste your ${language} code here...`}
        className="flex-1 bg-transparent font-mono text-sm text-lime/80 placeholder-ink-600 p-5 resize-none focus:outline-none min-h-[320px]"
        spellCheck={false}
      />

      {/* Footer */}
      <div className="px-5 py-4 border-t border-ink-600 flex items-center justify-between">
        <span className="text-xs font-mono text-ink-400">
          {code.length > 0 ? `${code.split("\n").length} lines` : "0 lines"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!code.trim() || isGenerating || disabled}
          className="bg-lime text-ink-900 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-lime-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <span className="w-3 h-3 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Docs ✦"
          )}
        </button>
      </div>
    </div>
  );
}
