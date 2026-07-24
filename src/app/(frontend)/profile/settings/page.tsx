"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?redirect=/profile/settings"); return; }
      if (user.user_metadata?.name) setName(user.user_metadata.name);
      setFetching(false);
    });
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ data: { name: name.trim() } });
    setLoading(false);
    if (error) setMessage("Gagal menyimpan: " + error.message);
    else setMessage("Nama berhasil diperbarui!");
  }

  if (fetching) return null;

  return (
    <Section>
      <Container size="sm">
      <h1 className="font-sans text-3xl font-extrabold text-fg-default">Account Settings</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-fg-default">Nama</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-full border border-border bg-bg-surface-muted px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
            required
          />
        </div>
        {message && <p className={`text-sm ${message.includes("Gagal") ? "text-error" : "text-primary"}`}>{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        </form>
      </Container>
    </Section>
  );
}
