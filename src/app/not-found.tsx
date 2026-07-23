import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl text-fg-default">404</h1>
      <p className="mt-4 text-lg text-fg-secondary">
        Halaman tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
