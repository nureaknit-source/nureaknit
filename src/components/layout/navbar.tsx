"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getProfileAction } from "@/actions/profile";
import { useCartCount } from "@/hooks/use-cart-count";
import { LogoutButton } from "@/components/shared/logout-button";
import type { User } from "@supabase/supabase-js";
import {
  ShoppingCart,
  Home,
  ShoppingBag,
  Scissors,
  Newspaper,
  Star,
  Info,
  User as UserIcon,
  LogIn,
  LogOut,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: ShoppingBag },
  { href: "/patterns", label: "Patterns", icon: Scissors },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/about", label: "About", icon: Info },
];

function CartNavLink({ count }: { count: number }) {
  return (
    <Link
      href="/profile/cart"
      transitionTypes={["page"]}
      className="relative text-fg-muted hover:text-primary"
      title="My Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-primary-fg">
          {count}
        </span>
      )}
    </Link>
  );
}

function DesktopGuestLinks() {
  return (
    <Link
      href="/login"
      transitionTypes={["page"]}
      className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
    >
      Masuk
    </Link>
  );
}

let profileSynced = false;

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const cartCount = useCartCount();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (profileSynced) return;
    profileSynced = true;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const { name } = await getProfileAction();
        setDisplayName(name);
      } else {
        setDisplayName("");
      }
    });

    return () => {
      subscription.unsubscribe();
      profileSynced = false;
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg-surface backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
          <Link href="/" className="font-display text-xl sm:text-2xl text-fg-default transition hover:opacity-90">
            Nurea Knit
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={["page"]}
                className={`relative text-sm lg:text-base transition hover:text-accent ${
                  pathname === link.href
                    ? "font-semibold text-primary"
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
          {user ? (
            <>
              <Link
                href="/profile"
                transitionTypes={["page"]}
                className="font-sans text-sm font-medium text-fg-default hover:text-primary"
              >
                {displayName || "Profile"}
              </Link>
              <CartNavLink count={cartCount} />
            </>
          ) : (
            <DesktopGuestLinks />
          )}
          </div>
        </nav>
      </header>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-3 right-4 z-80 flex h-10 w-10 items-center justify-center sm:top-4 sm:right-6 md:hidden"
        aria-label={cartCount > 0 ? `Toggle menu (${cartCount} item di keranjang)` : "Toggle menu"}
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
        {cartCount > 0 && !menuOpen && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-primary-fg animate-cart-pop">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-60 bg-overlay/30 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-y-0 right-0 z-70 flex w-[min(85vw,320px)] flex-col bg-bg-surface shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-20">
          {/* Nav links */}
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  transitionTypes={["page"]}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                    isActive
                      ? "bg-primary-subtle font-semibold text-primary"
                      : "text-fg-default hover:bg-accent-subtle"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? "text-primary" : "text-fg-muted"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-border" />

          {/* Auth actions */}
          <div className="flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href="/profile"
                  transitionTypes={["page"]}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    pathname === "/profile"
                      ? "bg-primary-subtle font-semibold text-primary"
                      : "text-fg-default hover:bg-accent-subtle"
                  } active:scale-[0.98]`}
                >
                  <UserIcon
                    className={`h-5 w-5 shrink-0 ${
                      pathname === "/profile" ? "text-primary" : "text-fg-muted"
                    }`}
                  />
                  <span>{displayName || "My Account"}</span>
                </Link>
                <Link
                  href="/profile/cart"
                  transitionTypes={["page"]}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                    pathname === "/profile/cart"
                      ? "bg-primary-subtle font-semibold text-primary"
                      : "text-fg-default hover:bg-accent-subtle"
                  } active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-3.5">
                    <ShoppingCart
                      className={`h-5 w-5 shrink-0 ${
                        pathname === "/profile/cart" ? "text-primary" : "text-fg-muted"
                      }`}
                    />
                    <span>My Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-primary-fg">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <LogoutButton className="flex w-full items-center gap-3.5 rounded-xl border border-border px-4 py-3 text-sm font-medium text-fg-secondary transition hover:bg-accent-subtle active:scale-[0.98]">
                  <LogOut className="h-5 w-5 shrink-0 text-fg-muted" />
                  <span>Logout</span>
                </LogoutButton>
              </>
            ) : (
              <Link
                href="/login"
                transitionTypes={["page"]}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2.5 rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-[0.98]"
              >
                <LogIn className="h-5 w-5 shrink-0" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
