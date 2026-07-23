"use server";

import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  await supabase.auth.signOut();
  redirect("/");
}
