"use client";

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">
        Terjadi Kesalahan
      </h1>
      <p className="mt-4 text-medium-gray">
        Maaf, terjadi kesalahan saat memuat halaman.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 rounded-lg bg-sage px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Coba Lagi
      </button>
    </div>
  );
}
