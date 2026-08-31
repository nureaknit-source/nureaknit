import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl text-fg-default">404</h1>
      <h2 className="mt-4 font-sans text-2xl font-bold text-fg-default">Oops! Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-fg-secondary max-w-md">
        Sepertinya halaman yang kamu cari sudah berpindah atau benangnya kusut di jalan. Yuk kembali ke beranda!
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
