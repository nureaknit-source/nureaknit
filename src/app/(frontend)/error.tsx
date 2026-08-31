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
      <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-fg-default">
        Ups, Terjadi Sedikit Kendala
      </h1>
      <p className="mt-3 text-sm sm:text-base text-fg-secondary max-w-md">
        Maaf, ada gangguan saat memuat halaman ini. Coba muat ulang sebentar lagi ya!
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
      >
        Muat Ulang Halaman
      </button>
    </div>
  );
}
