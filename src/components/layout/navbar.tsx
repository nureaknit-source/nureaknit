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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(168,133,105,0.1)] bg-[#F4EBE1]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl text-fg-default"
        >
          Nurea Knit
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-accent ${
                pathname === link.href
                  ? "font-medium text-primary"
                  : "text-fg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? <DesktopUserDropdown /> : <DesktopGuestLinks />}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-fg-default"
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
        <div className="border-t border-border bg-[#F4EBE1] px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-fg-secondary transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-border">
            {user ? <MobileUserLinks onClose={() => setMenuOpen(false)} /> : <MobileGuestLinks onClose={() => setMenuOpen(false)} />}
          </div>
        </div>
      )}
    </header>
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
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-[#F4EBE1] py-1 shadow-lg">
            <Link
              href="/profile/downloads"
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
        className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
      >
        Masuk
      </Link>
    );
  }

  function MobileUserLinks({ onClose }: { onClose: () => void }) {
    return (
      <>
        <Link
          href="/profile/downloads"
          onClick={onClose}
          className="rounded-full bg-primary px-4 py-2 text-center text-sm font-bold text-primary-fg"
        >
          Profile
        </Link>
        <button
          onClick={() => { handleLogout(); onClose(); }}
          className="rounded-full border border-border px-4 py-2 text-center text-sm font-medium text-fg-secondary"
        >
          Logout
        </button>
      </>
    );
  }

  function MobileGuestLinks({ onClose }: { onClose: () => void }) {
    return (
      <Link
        href="/login"
        onClick={onClose}
        className="rounded-full bg-primary px-4 py-2 text-center text-sm font-bold text-primary-fg"
      >
        Masuk
      </Link>
    );
  }
}
