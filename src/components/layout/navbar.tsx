"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/patterns", label: "Patterns" },
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
];

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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
    <header className="sticky top-0 z-50 bg-bg-surface backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-display text-xl text-fg-default"
        >
          Nurea Knit
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          transitionTypes={['page']}
          className={`relative text-sm transition hover:text-accent ${
            pathname === link.href
              ? "font-medium text-primary"
              : "text-fg-secondary"
          }`}
        >
          {link.label}
          {pathname === link.href && (
            <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary" />
          )}
        </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? <DesktopUserDropdown /> : <DesktopGuestLinks />}
        </div>

      </nav>
    </header>

    {/* Mobile hamburger — root level, above everything */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="fixed top-3 right-4 z-[80] flex h-10 w-10 items-center justify-center sm:top-4 sm:right-6 md:hidden"
      aria-label="Toggle menu"
    >
      <span className="flex flex-col items-center justify-center gap-1.5">
        <span
          className={`block h-0.5 w-6 rounded-full bg-fg-default transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 rounded-full bg-fg-default transition-all duration-300 ease-in-out ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 rounded-full bg-fg-default transition-all duration-300 ease-in-out ${
            menuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </span>
    </button>

    {/* Mobile menu overlay — root level */}
    {menuOpen && (
      <div
        className="fixed inset-0 z-[60] bg-overlay/30 backdrop-blur-sm md:hidden"
        onClick={() => setMenuOpen(false)}
      />
    )}

    {/* Mobile menu panel — root level */}
    <div
      className={`fixed inset-y-0 right-0 z-[70] flex w-[min(85vw,320px)] flex-col bg-bg-surface shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-20">
        {/* Nav links */}
        <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={['page']}
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-4 py-3 text-[15px] transition ${
                pathname === link.href
                  ? "bg-primary-subtle font-medium text-primary"
                  : "text-fg-default hover:bg-accent-subtle"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Auth actions */}
        <div className="flex flex-col gap-3">
          {user ? (
            <>
              <Link
                href="/profile/downloads"
                transitionTypes={['page']}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-[0.98]"
              >
                {user?.user_metadata?.name || "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-fg-secondary transition hover:bg-accent-subtle active:scale-[0.98]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              transitionTypes={['page']}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-[0.98]"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );

  function DesktopUserDropdown() {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
        >
          {user?.user_metadata?.name || "Profile"}
          <svg
            className={`h-4 w-4 transition ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-bg-surface py-1 shadow-lg">
            <Link
              href="/profile/downloads"
              transitionTypes={['page']}
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-fg-default transition hover:bg-accent-subtle"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-sm text-fg-secondary transition hover:bg-accent-subtle"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  function DesktopGuestLinks() {
    return (
      <Link
        href="/login"
        transitionTypes={['page']}
        className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
      >
        Masuk
      </Link>
    );
  }
}
