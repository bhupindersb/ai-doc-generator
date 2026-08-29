"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#C8F135" />
    <rect x="10" y="13" width="16" height="2.5" rx="1.25" fill="#0A0A0F" />
    <rect x="10" y="19" width="24" height="2.5" rx="1.25" fill="#0A0A0F" />
    <rect x="10" y="25" width="20" height="2.5" rx="1.25" fill="#0A0A0F" />
    <circle cx="33" cy="13" r="4" fill="#0A0A0F" />
    <path d="M31 13L32.5 14.5L35.5 11.5" stroke="#C8F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Nav structure
const navItems = [
  {
    label: "Product",
    dropdown: [
      { label: "Features",     href: "/features",     icon: "✦", desc: "Everything DocAI can do" },
      { label: "Integrations", href: "/integrations", icon: "🔌", desc: "GitHub, Notion, VS Code & more" },
      { label: "Roadmap",      href: "/roadmap",      icon: "🗺", desc: "What we're building next" },
    ],
  },
  {
    label: "Docs",
    dropdown: [
      { label: "Getting Started",  href: "/docs",                icon: "🚀", desc: "Up and running in 2 minutes" },
      { label: "API Reference",    href: "/docs/api",            icon: "⚡", desc: "REST API for developers" },
      { label: "GitHub Action",    href: "/docs/github-action",  icon: "⚙️", desc: "Auto-docs on every PR" },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

type DropdownItem = { label: string; href: string; icon: string; desc: string };
type NavItem = { label: string; href?: string; dropdown?: DropdownItem[] };

function DropdownMenu({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
      {/* Arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-ink-800 border-l border-t border-ink-600 rotate-45" />
      <div className="p-2">
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-ink-700 transition-all group"
          >
            <span className="text-base mt-0.5 flex-shrink-0">{item.icon}</span>
            <div>
              <p className="text-sm font-display font-bold group-hover:text-lime transition-colors">{item.label}</p>
              <p className="text-xs font-mono text-ink-500 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink-900/90 backdrop-blur-md border-b border-ink-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" ref={navRef}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <Logo />
          <span className="font-display font-bold text-xl tracking-tight">
            Doc<span className="text-lime">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item: NavItem) => (
            <div key={item.label} className="relative">
              {item.href ? (
                // Simple link (Pricing)
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-ink-300 hover:text-lime hover:bg-ink-800 transition-all"
                >
                  {item.label}
                </Link>
              ) : (
                // Dropdown trigger
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    openDropdown === item.label
                      ? "text-lime bg-ink-800"
                      : "text-ink-300 hover:text-lime hover:bg-ink-800"
                  }`}
                >
                  {item.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Dropdown */}
              {item.dropdown && openDropdown === item.label && (
                <DropdownMenu items={item.dropdown} onClose={() => setOpenDropdown(null)} />
              )}
            </div>
          ))}
        </div>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-bold font-display text-ink-200 hover:text-lime transition-colors">
                Dashboard
              </Link>
              {session.user?.image ? (
                <button onClick={() => signOut()} title="Sign out">
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-ink-600 hover:border-lime/40 transition-all" />
                </button>
              ) : (
                <button onClick={() => signOut()} className="text-sm text-ink-400 hover:text-ink-100 transition-colors font-mono">
                  Sign out
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("github")}
                className="flex items-center gap-2 border border-ink-600 hover:border-lime/40 text-sm font-semibold px-4 py-2 rounded-lg transition-all text-ink-200 hover:text-lime"
              >
                <GitHubIcon />Sign in
              </button>
              <Link href="/dashboard" className="bg-lime text-ink-900 font-bold text-sm px-4 py-2 rounded-lg hover:bg-lime-dim transition-all">
                Get started →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-ink-400 hover:text-ink-100 transition-colors p-1"
          onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }}
        >
          {mobileOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ink-900 border-t border-ink-800 px-4 py-4 space-y-1">
          {navItems.map((item: NavItem) => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-ink-300 hover:text-lime rounded-lg hover:bg-ink-800 transition-all"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-ink-300 hover:text-lime rounded-lg hover:bg-ink-800 transition-all"
                  >
                    {item.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === item.label && item.dropdown && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-ink-700 pl-4">
                      {item.dropdown.map(sub => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-2 py-2 text-xs font-mono text-ink-400 hover:text-lime transition-colors rounded-lg hover:bg-ink-800"
                        >
                          <span>{sub.icon}</span>{sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <div className="pt-3 border-t border-ink-800 space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-bold text-lime">
                  Dashboard →
                </Link>
                <button onClick={() => signOut()} className="block px-3 py-2.5 text-sm text-ink-400 font-mono">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { signIn("github"); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-ink-200 w-full">
                  <GitHubIcon />Sign in with GitHub
                </button>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block bg-lime text-ink-900 font-bold text-sm px-4 py-2.5 rounded-lg text-center">
                  Get started →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
