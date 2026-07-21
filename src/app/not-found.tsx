import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl font-semibold text-charcoal">404</h1>
      <p className="mt-4 text-lg text-medium-gray">
        Halaman tidak ditemukan.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-sage px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
