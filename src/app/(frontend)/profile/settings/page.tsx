import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/settings");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">Account Settings</h1>
      <div className="mt-6 rounded-lg border border-light-gray bg-off-white p-6">
        <p className="text-sm font-medium text-charcoal">{user.email}</p>
        <p className="mt-1 text-sm text-medium-gray">
          {user.user_metadata?.name || "No name set"}
        </p>
      </div>
      <p className="mt-6 text-medium-gray">Coming soon.</p>
    </div>
  );
}
