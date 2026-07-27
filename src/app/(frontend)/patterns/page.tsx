import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateInView } from "@/components/shared/animate-in-view";
import { EmptyState } from "@/components/shared/empty-state";
import { getCollection } from "@/lib/payload/client";
import { mediaUrl, difficultyLabel } from "@/lib/payload/utils";
import type { Media, Pattern, PatternCategory } from "@/lib/payload/payload-types";

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
    getCollection<Pattern>("patterns", { where, page }),
    getCollection<PatternCategory>("pattern-categories"),
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
              transitionTypes={['page']}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                !params.category
                  ? "bg-primary text-primary-fg"
                  : "bg-accent-subtle text-fg-secondary hover:bg-primary-subtle"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                transitionTypes={['page']}
                href={`/patterns?category=${cat.slug || cat.id}`}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  params.category === (cat.slug || cat.id)
                    ? "bg-primary text-primary-fg"
                    : "bg-accent-subtle text-fg-secondary hover:bg-primary-subtle"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {patterns.length === 0 ? (
          <div className="mt-12">
            <AnimateInView><EmptyState title="Belum ada pattern" message="Pattern akan segera hadir. Pantau terus!" /></AnimateInView>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((pattern, i) => {
              const img = mediaUrl(pattern.image as Media | number | null);
              return (
                <AnimateInView key={pattern.id} className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}>
                  <Link href={`/patterns/${pattern.slug || pattern.id}`} transitionTypes={['page']}>
                    <Card hover className="h-full flex flex-col">
                      {img && (
                          <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
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
                          <Badge variant="primary">{difficultyLabel(pattern.difficulty)}</Badge>
                        )}
                        {pattern.featured && <Badge variant="accent">Featured</Badge>}
                      </div>
                      <h3 className="font-sans text-lg font-bold text-fg-default">
                        {pattern.title}
                      </h3>
                      {pattern.description && (
                        <Text size="sm" className="mt-1 line-clamp-2">
                          {pattern.description}
                        </Text>
                      )}
                    </Card>
                  </Link>
                </AnimateInView>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
