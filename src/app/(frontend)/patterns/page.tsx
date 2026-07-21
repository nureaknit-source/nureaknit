import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getPatterns, getPatternCategories } from "@/lib/payload/client";
import { mediaUrl, difficultyLabel } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/cms-types";

export const metadata = {
  title: "Pattern Library — Nurea Knit",
  description: "Browse knitting and crochet patterns. Filter by category, difficulty, and more.",
};

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};

  if (params.category) where["categories.category"] = { equals: params.category };
  if (params.difficulty) where.difficulty = { equals: params.difficulty };

  const page = params.page ? parseInt(params.page, 10) : 1;

  const [patternsData, categoriesData] = await Promise.all([
    getPatterns({ where, page, limit: 50 }),
    getPatternCategories(),
  ]);

  const patterns = patternsData?.docs || [];
  const categories = categoriesData?.docs || [];

  return (
    <Section>
      <Container>
        <Heading as="h1">Pattern Library</Heading>
        <Text className="mt-2">Discover your next project.</Text>

        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/patterns"
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                !params.category
                  ? "bg-sage text-white"
                  : "bg-light-gray text-medium-gray hover:bg-sage/20"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/patterns?category=${cat.slug || cat.id}`}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  params.category === (cat.slug || cat.id)
                    ? "bg-sage text-white"
                    : "bg-light-gray text-medium-gray hover:bg-sage/20"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {patterns.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Belum ada pattern" message="Pattern akan segera hadir. Pantau terus!" />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((pattern) => {
              const img = mediaUrl(pattern.image as Media | number | null);
              return (
                <Link key={pattern.id} href={`/patterns/${pattern.slug || pattern.id}`}>
                  <Card hover className="h-full flex flex-col">
                    {img && (
                      <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                        <img
                          src={img}
                          alt=""
                          className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {pattern.difficulty && (
                        <Tag variant="sage">{difficultyLabel(pattern.difficulty)}</Tag>
                      )}
                      {pattern.featured && <Tag variant="gold">Featured</Tag>}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal">
                      {pattern.title}
                    </h3>
                    {pattern.description && (
                      <Text size="sm" className="mt-1 line-clamp-2">
                        {pattern.description}
                      </Text>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
