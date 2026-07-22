import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getWishlistAction } from "@/actions/wishlist";
import { getPayload } from "payload";
import config from "@payload-config";

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/profile/wishlist");

  let ids: number[] = [];
  try { ids = await getWishlistAction(); } catch {}

  if (ids.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <h1 className="font-serif text-3xl font-semibold text-charcoal">My Wishlist</h1>
        <div className="mt-8 text-center py-16 text-medium-gray">
          <p>Belum ada produk di wishlist.</p>
          <a href="/products" className="mt-2 inline-block text-sage underline">Jelajahi produk</a>
        </div>
      </div>
    );
  }

  const payload = await getPayload({ config });
  const products = await payload.find({
    collection: "products",
    where: { id: { in: ids } } as any,
    limit: 999,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">My Wishlist</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.docs.map((product: any) => (
          <a key={product.id} href={`/products/${product.slug || product.id}`} className="group rounded-lg border border-light-gray p-4 transition hover:border-sage">
            <h3 className="font-serif text-lg font-semibold text-charcoal group-hover:text-sage">{product.title}</h3>
            {product.price && (
              <p className="mt-1 text-sm font-medium text-sage">Rp {product.price.toLocaleString("id-ID")}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
