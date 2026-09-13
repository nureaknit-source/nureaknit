import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl text-fg-default transition hover:opacity-90"
        >
          Nurea Knit
        </Link>

        {/* Security Badge (No Stepping) */}
        <div className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success-subtle px-3 py-1 text-xs font-semibold text-success">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Checkout Aman &amp; Terenkripsi</span>
          <span className="sm:hidden">Aman</span>
        </div>

        {/* Return link to Cart */}
        <Link
          href="/profile/cart"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-fg-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Keranjang</span>
        </Link>
      </div>
    </header>
  );
}
