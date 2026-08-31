"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-sans text-4xl font-extrabold text-fg-default">
        Ups, Terjadi Sedikit Kendala
      </h1>
      <p className="mt-3 text-fg-secondary max-w-md">
        Maaf, ada gangguan teknis saat memproses permintaanmu. Coba muat ulang ya!
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
