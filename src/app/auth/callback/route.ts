import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sendWelcomeEmailAction } from "@/actions/email";
import { upsertUserProfile } from "@/actions/profile";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const cookieStore = await cookies();

  if (code) {
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }
    const user = data.user;

    if (user && user.created_at === user.last_sign_in_at) {
      const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";

      try {
        await upsertUserProfile({
          supabaseId: user.id,
          email: user.email || "",
          displayName: name,
        });
      } catch {
        // user-profiles collection might not exist yet
      }

      void sendWelcomeEmailAction(user.email!, name);
    }
  }

  const saved = cookieStore.get("auth_redirect")?.value
    ? decodeURIComponent(cookieStore.get("auth_redirect")!.value)
    : null;
  const redirect = saved || searchParams.get("redirect");
  const target = redirect?.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/";

  const response = NextResponse.redirect(new URL(target, request.url));
  response.cookies.set("auth_redirect", "", { path: "/", maxAge: 0 });
  return response;
}
