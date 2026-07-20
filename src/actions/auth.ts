"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  await supabase.auth.signOut();
  redirect("/");
}

export async function checkEmailAction(email: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) return { ok: false as const, error: "Gagal memverifikasi email" };

  const exists = data.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );

  if (exists) return { ok: false as const, error: "Email sudah terdaftar" };

  return { ok: true as const };
}
