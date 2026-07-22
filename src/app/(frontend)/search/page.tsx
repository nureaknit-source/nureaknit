import { Suspense } from "react";
import { searchContent } from "@/lib/payload/client";

async function SearchResults({ q }: { q: string }) {
  if (!q.trim()) {
    return <p className="text-medium-gray">Masukkan kata kunci pencarian.</p>;
  }

  const { patterns, posts, products } = await searchContent(q);
  const total = patterns.length + posts.length + products.length;

  if (total === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-medium-gray">Tidak ada hasil untuk &ldquo;<span className="font-medium text-charcoal">{q}</span>&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {patterns.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Patterns ({patterns.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((p: any) => (
              <a key={p.id} href={`/patterns/${p.slug}`} className="group rounded-lg border border-light-gray p-4 transition hover:border-sage">
                <h3 className="font-medium text-charcoal group-hover:text-sage">{p.title}</h3>
                {p.difficulty && <p className="mt-1 text-xs text-medium-gray capitalize">{p.difficulty}</p>}
              </a>
            ))}
          </div>
        </section>
      )}
      {posts.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Blog Posts ({posts.length})</h2>
          <div className="mt-4 space-y-4">
            {posts.map((p: any) => (
              <a key={p.id} href={`/blog/${p.slug}`} className="block rounded-lg border border-light-gray p-4 transition hover:border-sage">
                <h3 className="font-medium text-charcoal">{p.title}</h3>
                {p.excerpt && <p className="mt-1 text-sm text-medium-gray line-clamp-2">{p.excerpt}</p>}
              </a>
            ))}
          </div>
        </section>
      )}
      {products.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Products ({products.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p: any) => (
              <a key={p.id} href={`/products/${p.slug}`} className="group rounded-lg border border-light-gray p-4 transition hover:border-sage">
                <h3 className="font-medium text-charcoal group-hover:text-sage">{p.title}</h3>
                {p.price && <p className="mt-1 text-sm font-medium text-sage">Rp {p.price.toLocaleString("id-ID")}</p>}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">Search</h1>
      <Suspense fallback={<div className="mt-8 animate-pulse space-y-4"><div className="h-6 w-48 rounded bg-light-gray" /><div className="h-32 rounded bg-light-gray" /></div>}>
        <div className="mt-6">
          <SearchResults q={q} />
        </div>
      </Suspense>
    </div>
  );
}
