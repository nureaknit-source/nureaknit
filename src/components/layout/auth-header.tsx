import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthHeader() {
  return (
    <header className="border-b border-border bg-bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl text-fg-default transition hover:opacity-90"
        >
          Nurea Knit
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-fg-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </header>
  );
}
