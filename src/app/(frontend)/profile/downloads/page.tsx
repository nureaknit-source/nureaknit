import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { logoutAction } from "@/actions/auth";

export default async function DownloadsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/downloads");
  }

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">My Downloads</h1>
      <div className="mt-6 rounded-lg border border-light-gray bg-off-white p-6">
        <p className="text-sm text-medium-gray">
          Halo, <span className="font-medium text-charcoal">{name}</span>.
        </p>
        <p className="mt-1 text-sm text-medium-gray">{user.email}</p>
      </div>
      <div className="mt-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mx-auto size-16 text-light-gray">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <p className="mt-4 text-medium-gray">Belum ada pembelian.</p>
        <p className="text-sm text-medium-gray">Pola yang kamu beli akan muncul di sini.</p>
      </div>
      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="rounded-lg border border-light-gray px-4 py-2 text-sm font-medium text-medium-gray transition hover:bg-light-gray"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
