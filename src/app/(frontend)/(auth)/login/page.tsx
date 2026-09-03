"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    const redirect = new URLSearchParams(window.location.search).get("redirect");
    // ponytail: keep redirectTo clean — a query string breaks Supabase's exact
    // Redirect URLs match and falls back to Site URL (localhost). Carry the
    // target in a cookie instead; the callback reads it server-side.
    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      document.cookie = `auth_redirect=${encodeURIComponent(redirect)}; path=/; samesite=lax; max-age=600`;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (authError) {
      setError("Gagal terhubung ke Google. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-bg-surface p-8">
        <h1 className="text-center font-sans text-2xl font-extrabold text-fg-default">
          Masuk
        </h1>

        {error && (
          <p className="text-center text-sm text-error">{error}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-bg-surface-muted px-4 py-2.5 text-sm font-bold text-fg-default transition hover:bg-accent-subtle active:scale-95 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading ? "Memuat..." : "Masuk dengan Google"}
        </button>

        <div className="space-y-2 text-center text-xs text-fg-muted">
          <p>Login dengan akun Google. Email kamu otomatis terverifikasi.</p>
          <p className="leading-relaxed">
            Dengan masuk, kamu menyetujui{" "}
            <Link
              href="/terms"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              Syarat &amp; Ketentuan
            </Link>{" "}
            serta{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              Kebijakan Privasi
            </Link>{" "}
            Nurea Knit.
          </p>
        </div>
      </div>
    </div>
  );
}
