import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

const PUBLIC_ADMIN_ROUTES = [
  "/admin/login",
  "/admin/create-first-user",
  "/admin/forgot",
  "/admin/reset",
  "/admin/logout",
  "/admin/unauthorized",
  "/admin/logout-inactivity",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isVerify = pathname.includes("/verify/");
    const isPublic = isVerify || PUBLIC_ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!isPublic && !request.cookies.has("payload-token")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const { supabase, supabaseResponse } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
