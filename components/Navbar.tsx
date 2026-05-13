// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink-900/80 backdrop-blur-md border-b border-ink-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="12" fill="#C8F135"/>
            <rect x="10" y="13" width="16" height="2.5" rx="1.25" fill="#0A0A0F"/>
            <rect x="10" y="19" width="24" height="2.5" rx="1.25" fill="#0A0A0F"/>
            <rect x="10" y="25" width="20" height="2.5" rx="1.25" fill="#0A0A0F"/>
            <circle cx="33" cy="13" r="4" fill="#0A0A0F"/>
            <path d="M31 13L32.5 14.5L35.5 11.5" stroke="#C8F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-display font-bold text-xl">Doc<span className="text-lime">AI</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-ink-200">
          <Link href="/#pricing" className="hover:text-lime transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-lime transition-colors">Docs</Link>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-ink-100 hover:text-lime transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-ink-400 hover:text-ink-100 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="flex items-center gap-2 bg-ink-800 border border-ink-600 hover:border-lime/50 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:text-lime"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
