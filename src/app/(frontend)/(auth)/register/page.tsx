"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendWelcomeEmailAction } from "@/actions/email";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (signUpError) {
      setError(signUpError.message === "User already registered"
        ? "Email sudah terdaftar"
        : "Gagal mendaftar");
      setLoading(false);
      return;
    }

    void sendWelcomeEmailAction(email, name);
    setRegistered(true);
  }

  if (registered) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-[#F4EBE1] p-8 text-center">
          <h1 className="font-sans text-2xl font-extrabold text-fg-default">
            Cek Email Kamu
          </h1>
          <p className="mt-4 text-sm text-fg-secondary">
            Kami sudah mengirimkan email konfirmasi. Klik tautan di email untuk mengaktifkan akun kamu.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
          >
            Ke Halaman Masuk
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-[#F4EBE1] p-8"
      >
        <h1 className="font-sans text-2xl font-extrabold text-fg-default">
          Daftar
        </h1>

        {error && <p className="text-sm text-error">{error}</p>}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-fg-default">
            Nama
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="mt-1 w-full rounded-full border border-border bg-[rgba(244,235,225,0.5)] px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fg-default">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-full border border-border bg-[rgba(244,235,225,0.5)] px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
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
            minLength={8}
            className="mt-1 w-full rounded-full border border-border bg-[rgba(244,235,225,0.5)] px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-fg-default">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="mt-1 w-full rounded-full border border-border bg-[rgba(244,235,225,0.5)] px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Memuat..." : "Daftar"}
        </button>

        <p className="text-center text-sm text-fg-secondary">
          Sudah punya akun?{" "}
          <a href="/login" className="text-primary underline transition hover:text-accent">
            Masuk
          </a>
        </p>
      </form>
    </div>
  );
}
