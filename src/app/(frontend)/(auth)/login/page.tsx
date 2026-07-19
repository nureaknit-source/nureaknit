"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
        className="w-full max-w-sm space-y-4 rounded-lg border border-light-gray bg-off-white p-8"
      >
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Masuk
        </h1>

        {error && <p className="text-sm text-error">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-light-gray px-3 py-2 text-sm focus:border-sage focus:ring-2 focus:ring-sage/10"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-charcoal">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-light-gray px-3 py-2 text-sm focus:border-sage focus:ring-2 focus:ring-sage/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sage px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Memuat..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-medium-gray">
          Belum punya akun?{" "}
          <a href="/register" className="text-sage underline transition hover:text-terracotta">
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
}
