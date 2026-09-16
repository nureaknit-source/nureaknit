"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@payloadcms/ui";
import { Home, Package, ShoppingBag, MessageSquare, Menu } from "lucide-react";

export function MobileNavDock() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hanya tampilkan jika admin sudah berhasil login dan bukan di halaman auth
  const isAuthRoute =
    !pathname ||
    pathname.includes("/login") ||
    pathname.includes("/create-first-user") ||
    pathname.includes("/forgot") ||
    pathname.includes("/reset") ||
    pathname.includes("/logout");

  if (!user || isAuthRoute) {
    return null;
  }

  const handleOpenMenu = () => {
    // Cari tombol toggle nav bawaan Payload CMS di header
    const toggler = document.querySelector<HTMLButtonElement>(
      ".nav-toggler, button[aria-label*='navigation' i], button[aria-label*='menu' i], .app-header__nav-toggler, [class*='nav-toggler']"
    );
    if (toggler) {
      toggler.click();
    } else {
      // Fallback: trigger drawer class jika selector spesifik tidak tertangkap
      const nav = document.querySelector<HTMLElement>(".nav, [class*='template-default__nav']");
      if (nav) {
        nav.classList.toggle("nav--is-open");
      }
    }
  };

  const navItems = [
    {
      href: "/admin",
      label: "Beranda",
      icon: Home,
      isActive: pathname === "/admin",
    },
    {
      href: "/admin/collections/orders",
      label: "Pesanan",
      icon: Package,
      isActive: pathname?.startsWith("/admin/collections/orders"),
    },
    {
      href: "/admin/collections/products",
      label: "Produk",
      icon: ShoppingBag,
      isActive: pathname?.startsWith("/admin/collections/products"),
    },
    {
      href: "/admin/collections/contact-messages",
      label: "Pesan",
      icon: MessageSquare,
      isActive:
        pathname?.startsWith("/admin/collections/contact-messages") ||
        pathname?.startsWith("/admin/collections/coaching-requests"),
    },
  ];

  return (
    <nav className="nurea-mobile-dock" aria-label="Mobile Admin Navigation">
      <div className="nurea-mobile-dock__inner">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nurea-mobile-dock__item ${
                item.isActive ? "nurea-mobile-dock__item--active" : ""
              }`}
            >
              <div className="nurea-mobile-dock__icon-wrapper">
                <IconComponent size={20} strokeWidth={item.isActive ? 2.5 : 2} />
              </div>
              <span className="nurea-mobile-dock__label">{item.label}</span>
            </Link>
          );
        })}

        {/* Full Menu Drawer Toggle */}
        <button
          type="button"
          onClick={handleOpenMenu}
          className="nurea-mobile-dock__item"
          title="Buka Menu Lengkap"
        >
          <div className="nurea-mobile-dock__icon-wrapper">
            <Menu size={20} strokeWidth={2} />
          </div>
          <span className="nurea-mobile-dock__label">Menu</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileNavDock;
