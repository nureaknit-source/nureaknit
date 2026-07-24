import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { logoutAction } from "@/actions/auth";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default async function DownloadsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/downloads");
  }

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <Section>
      <Container>
      <h1 className="font-sans text-3xl font-extrabold text-fg-default">My Downloads</h1>
      <div className="mt-6 rounded-lg border border-border bg-bg-surface p-6">
        <p className="text-sm text-fg-secondary">
          Halo, <span className="font-bold text-fg-default">{name}</span>.
        </p>
        <p className="mt-1 text-sm text-fg-muted">{user.email}</p>
      </div>
      <div className="mt-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mx-auto size-16 text-fg-muted">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <p className="mt-4 text-fg-secondary">Belum ada pembelian.</p>
        <p className="text-sm text-fg-muted">Pola yang kamu beli akan muncul di sini.</p>
      </div>
      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="rounded-full border border-border px-4 py-2 text-sm font-bold text-fg-secondary transition hover:bg-accent-subtle active:scale-95"
        >
          Logout
        </button>
      </form>
    </Container>
  </Section>
  );
}
