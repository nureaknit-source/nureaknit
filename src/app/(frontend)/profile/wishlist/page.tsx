import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getWishlistAction } from "@/actions/wishlist";
import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/profile/wishlist");

  let ids: number[] = [];
  try { ids = await getWishlistAction(); } catch {}

  if (ids.length === 0) {
    return (
      <Section>
        <Container>
        <h1 className="font-sans text-3xl font-extrabold text-fg-default">My Wishlist</h1>
        <div className="mt-8 text-center py-16 text-fg-secondary">
          <p>Belum ada produk di wishlist.</p>
          <Link href="/products" className="mt-2 inline-block text-primary underline hover:text-accent">Jelajahi produk</Link>
        </div>
      </Container>
    </Section>
    );
  }

  const payload = await getPayload({ config });
  const products = await payload.find({
    collection: "products",
    where: { id: { in: ids } } as any,
    limit: 999,
  });

  return (
    <Section>
      <Container>
      <h1 className="font-sans text-3xl font-extrabold text-fg-default">My Wishlist</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.docs.map((product: any) => (
          <Link key={product.id} href={`/products/${product.slug || product.id}`} className="group rounded-lg border border-border bg-bg-surface p-4 shadow-md transition hover:shadow-lg">
            <h3 className="font-sans text-lg font-bold text-fg-default group-hover:text-primary">{product.title}</h3>
            {product.price && (
              <p className="mt-1 text-sm font-bold text-primary">Rp {product.price.toLocaleString("id-ID")}</p>
            )}
          </Link>
        ))}
      </div>
    </Container>
  </Section>
  );
}
