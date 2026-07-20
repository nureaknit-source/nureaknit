import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/wishlist");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">My Wishlist</h1>
      <p className="mt-4 text-medium-gray">Coming soon.</p>
    </div>
  );
}
