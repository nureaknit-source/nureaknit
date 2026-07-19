"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/patterns", label: "Patterns" },
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
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
            <Link
              href="/profile/downloads"
              className="rounded-lg bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Profile
            </Link>
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
              <Link
                href="/profile/downloads"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-charcoal px-4 py-2 text-center text-sm font-medium text-white"
              >
                Profile
              </Link>
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
