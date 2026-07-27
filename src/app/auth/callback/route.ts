import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sendWelcomeEmailAction } from "@/actions/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const user = data.user;

    if (user && user.created_at === user.last_sign_in_at) {
      const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";
      void sendWelcomeEmailAction(user.email!, name);
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
