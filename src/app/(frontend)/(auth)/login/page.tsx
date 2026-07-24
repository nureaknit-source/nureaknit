"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-bg-surface p-8"
      >
        <h1 className="font-sans text-2xl font-extrabold text-fg-default">
          Masuk
        </h1>

        {error && <p className="text-sm text-error">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fg-default">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-full border border-border bg-bg-surface-muted px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-fg-default">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-full border border-border bg-bg-surface-muted px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Memuat..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-fg-secondary">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary underline transition hover:text-accent">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
