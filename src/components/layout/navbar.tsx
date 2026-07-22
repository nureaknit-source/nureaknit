"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/patterns", label: "Patterns" },
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/search", label: "Search" },
    { href: "/coaching", label: "Coaching" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-light-gray bg-off-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-charcoal"
        >
          Nurea Knit
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-sage ${
                pathname === link.href
                  ? "font-medium text-sage"
                  : "text-medium-gray"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                {user.user_metadata?.name || "Profile"}
                <svg
                  className={`h-4 w-4 transition ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-light-gray bg-white py-1 shadow-lg">
                  <Link
                    href="/profile/downloads"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-charcoal transition hover:bg-off-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-medium-gray transition hover:bg-off-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-medium-gray transition hover:text-charcoal"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-sage px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-light-gray bg-off-white px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-medium-gray transition hover:text-sage"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-light-gray">
            {user ? (
              <>
                <Link
                  href="/profile/downloads"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-charcoal px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="rounded-lg border border-light-gray px-4 py-2 text-center text-sm font-medium text-medium-gray"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-light-gray px-4 py-2 text-center text-sm font-medium text-charcoal"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-sage px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
