// app/auth/error/page.tsx
// Handles NextAuth error redirects gracefully
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errors: Record<string, { title: string; desc: string }> = {
  Configuration:   { title: "Server configuration error",   desc: "There is a problem with the server configuration. Please contact support." },
  AccessDenied:    { title: "Access denied",                desc: "You do not have permission to sign in." },
  Verification:    { title: "Verification failed",          desc: "The sign in link is no longer valid. It may have been used already or it may have expired." },
  OAuthCallback:   { title: "OAuth callback error",         desc: "There was a problem signing in with GitHub. Please try again." },
  OAuthCreateAccount: { title: "Account creation failed",  desc: "Could not create an account. Please try again or contact support." },
  Default:         { title: "Authentication error",         desc: "An unexpected error occurred during sign in. Please try again." },
};

function ErrorContent() {
  const params = useSearchParams();
  const errorCode = params.get("error") ?? "Default";
  const error = errors[errorCode] ?? errors.Default;

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="12" fill="#C8F135"/>
            <rect x="10" y="13" width="16" height="2.5" rx="1.25" fill="#0A0A0F"/>
            <rect x="10" y="19" width="24" height="2.5" rx="1.25" fill="#0A0A0F"/>
            <rect x="10" y="25" width="20" height="2.5" rx="1.25" fill="#0A0A0F"/>
            <circle cx="33" cy="13" r="4" fill="#0A0A0F"/>
            <path d="M31 13L32.5 14.5L35.5 11.5" stroke="#C8F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-display font-bold text-xl">Doc<span className="text-lime">AI</span></span>
        </Link>

        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-8">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5">
            ⚠️
          </div>
          <h1 className="text-xl font-display font-bold mb-3">{error.title}</h1>
          <p className="text-sm font-mono text-ink-400 leading-relaxed mb-6">{error.desc}</p>

          {errorCode && (
            <p className="text-xs font-mono text-ink-600 mb-6">
              Error code: <span className="text-ink-400">{errorCode}</span>
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/api/auth/signin"
              className="bg-lime text-ink-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-lime-dim transition-all"
            >
              Try signing in again
            </Link>
            <Link
              href="/"
              className="border border-ink-600 text-ink-300 font-semibold text-sm px-6 py-3 rounded-xl hover:border-ink-400 transition-all"
            >
              Back to homepage
            </Link>
          </div>

          <p className="mt-6 text-xs font-mono text-ink-600">
            Still having trouble?{" "}
            <a href="mailto:hello@beveez.tech" className="text-lime hover:underline">
              Contact support →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
