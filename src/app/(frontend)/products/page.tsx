import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AnimateInView } from "@/components/shared/animate-in-view";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/features/product-card";
import { getCollection } from "@/lib/payload/client";
import type { Product, ProductCategory } from "@/lib/payload/payload-types";
import { Search, Funnel } from "lucide-react";

const ALLOWED_SORTS = ["-createdAt", "price", "-price", "title", "-title"];

const sortOptions = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
  { value: "title", label: "Name A–Z" },
];

function buildHref(
  params: { category?: string; q?: string; sort?: string },
  extra: Record<string, string> = {},
): string {
  const u = new URLSearchParams();
  if (params.q) u.set("q", params.q);
  if (params.category) u.set("category", params.category);
  if (params.sort) u.set("sort", params.sort);
  Object.entries(extra).forEach(([k, v]) => u.set(k, v));
  return `/products?${u.toString()}`;
}

const pillBase =
  "inline-flex rounded-full px-3.5 py-1.5 text-xs font-bold transition";
const pillActive = `${pillBase} bg-primary text-primary-fg`;
const pillInactive =
  `${pillBase} bg-accent-subtle text-fg-secondary hover:bg-accent-subtle/50`;

const pageActiveCls =
  "inline-flex min-w-[44px] min-h-[44px] items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-fg";
const pageInactiveCls =
  "inline-flex min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-border bg-bg-surface text-sm font-bold text-accent transition hover:bg-accent-subtle/50";

function SearchForm({
  q,
  category,
  sort,
  className = "",
}: {
  q: string;
  category?: string;
  sort: string;
  className?: string;
}) {
  return (
    <form action="/products" method="get" className={`relative w-full ${className}`}>
      {category && <input type="hidden" name="category" value={category} />}
      {sort !== "-createdAt" && <input type="hidden" name="sort" value={sort} />}
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search yarn, needles, kits…"
        className="w-full rounded-full border border-border bg-bg-surface px-4 py-2.5 text-sm text-fg-secondary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent-subtle"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-fg-muted hover:text-fg-default"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}

function FilterPills({
  q,
  sort,
  category,
  categories,
}: {
  q: string;
  sort: string;
  category?: string;
  categories: ProductCategory[];
}) {
  const qsParams = { category, q, sort };
  return (
    <>
      <p className="px-1 pb-2 text-xs font-bold uppercase text-fg-muted">
        Sort by
      </p>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((opt) => (
          <Link
            key={opt.value}
            href={buildHref(qsParams, { sort: opt.value })}
            transitionTypes={["page"]}
            className={sort === opt.value ? pillActive : pillInactive}
          >
            {opt.label}
          </Link>
        ))}
      </div>
      {categories.length > 0 && (
        <>
          <div className="my-2 h-px bg-border" />
          <p className="px-1 pb-1 text-xs font-bold uppercase text-fg-muted">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref(qsParams, { category: "" })}
              transitionTypes={["page"]}
              className={!category ? pillActive : pillInactive}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildHref(qsParams, { category: cat.slug || String(cat.id) })}
                transitionTypes={["page"]}
                className={
                  category === (cat.slug || String(cat.id))
                    ? pillActive
                    : pillInactive
                }
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function pageNumbers(total: number, current: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const nums: (number | "…")[] = [1];
  if (current > 3) nums.push("…");
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let i = lo; i <= hi; i++) nums.push(i);
  if (current < total - 2) nums.push("…");
  nums.push(total);
  return nums.filter(
    (v, i) => !(v === "…" && i > 0 && nums[i - 1] === "…"),
  );
}

export const metadata = {
  title: "Shop — Nurea Knit",
  description: "Browse knitting and crochet products, tools, and accessories.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category;
  const sort = ALLOWED_SORTS.includes(params.sort) ? params.sort : "-createdAt";
  const page = Math.max(1, Number(params.page) || 1);

  const where: Record<string, unknown> = {};
  if (category) where["categories.slug"] = { equals: category };
  if (q) where["title"] = { contains: q };

  const {
    docs: products,
    totalPages,
    hasNextPage,
    hasPrevPage,
    page: currentPage,
  } = await getCollection<Product>("products", { where, page, sort });
  const { docs: categories } =
    await getCollection<ProductCategory>("product-categories");

  const hasActiveFilters = q || category;

  return (
    <Section spacing="sm">
      <Container>
        {/* Mobile toolbar: search + filter funnel (native <details>) */}
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <SearchForm q={q} category={category} sort={sort} className="flex-1" />
          <details className="relative">
            <summary
              className="list-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-bg-surface text-fg-secondary hover:text-fg-default"
              aria-label="Toggle filters"
            >
              <Funnel className="h-4 w-4" />
            </summary>
            <div
              className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-border bg-bg-surface p-3 shadow-lg sm:w-60"
              style={{ boxShadow: "0 20px 50px rgba(91,65,54,.14)" }}
            >
              <FilterPills q={q} sort={sort} category={category} categories={categories} />
            </div>
          </details>
        </div>

        {/* Desktop: full-width search + inline filter pills */}
        <div className="hidden lg:block">
          <div className="mb-4">
            <SearchForm q={q} category={category} sort={sort} />
          </div>
          <FilterPills q={q} sort={sort} category={category} categories={categories} />
        </div>

        {products.length === 0 ? (
          <div className="mt-12 text-center">
            <AnimateInView>
              <EmptyState title="No products yet" message="Produk akan segeri hadir!" />
            </AnimateInView>
            {hasActiveFilters && (
              <Link
                href="/products"
                className="mt-4 inline-block text-sm font-bold text-primary hover:text-accent"
              >
                Clear search &amp; filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <AnimateInView
                  key={product.id}
                  className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}
                >
                   <ProductCard
                      product={product}
                      priority={i === 0}
                    />
                </AnimateInView>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-1.5 text-sm font-bold"
                aria-label="Pagination"
              >
                {hasPrevPage && (
                  <Link
                    href={buildHref(
                      { category, q, sort },
                      { page: String(currentPage - 1) },
                    )}
                    transitionTypes={["page"]}
                    className={pageInactiveCls}
                  >
                    &larr; Prev
                  </Link>
                )}
                {pageNumbers(totalPages, currentPage).map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="flex min-w-[44px] min-h-[44px] items-center justify-center text-fg-muted"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={buildHref({ category, q, sort }, { page: String(p) })}
                      transitionTypes={["page"]}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={
                        p === currentPage ? pageActiveCls : pageInactiveCls
                      }
                    >
                      {p}
                    </Link>
                  ),
                )}
                {hasNextPage && (
                  <Link
                    href={buildHref(
                      { category, q, sort },
                      { page: String(currentPage + 1) },
                    )}
                    transitionTypes={["page"]}
                    className={pageInactiveCls}
                  >
                    Next &rarr;
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
