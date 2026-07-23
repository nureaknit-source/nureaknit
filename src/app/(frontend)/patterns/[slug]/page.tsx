import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { getBySlug } from "@/lib/payload/client";
import { mediaUrl, difficultyLabel, formatDate } from "@/lib/payload/utils";
import type { Pattern } from "@/lib/payload/payload-types";

// ponytail: getBySlug<Pattern> provides proper typing for pattern pages

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = await getBySlug<Pattern>("patterns", slug);
  if (!pattern) return { title: "Not Found" };
  return {
    title: `${pattern.title} — Nurea Knit`,
    description: pattern.description || undefined,
  };
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = await getBySlug<Pattern>("patterns", slug);

  if (!pattern) notFound();

  const img = mediaUrl(pattern.image);

  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          crumbs={[
            { label: "Patterns", href: "/patterns" },
            { label: pattern.title },
          ]}
        />

        {img && (
          <div className="overflow-hidden rounded-lg">
            <img
              src={img}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <Caption>Pattern</Caption>
          <Heading as="h1" className="mt-2">
            {pattern.title}
          </Heading>

          <div className="mt-4 flex flex-wrap gap-2">
            {pattern.difficulty && (
              <Badge variant="primary">{difficultyLabel(pattern.difficulty)}</Badge>
            )}
            {pattern.featured && <Badge variant="accent">Featured</Badge>}
            {pattern.yarnWeight && <Badge variant="secondary">{pattern.yarnWeight}</Badge>}
          </div>

          {pattern.publishedAt && (
            <Text size="sm" className="mt-4">
              Published {formatDate(pattern.publishedAt)}
            </Text>
          )}
        </div>

        <div className="mt-8">
          {pattern.description && (
            <p className="text-lg text-fg-secondary leading-relaxed">
              {pattern.description}
            </p>
          )}
        </div>

        {pattern.content && (
          <div className="mt-8">
            <RichText data={pattern.content} />
          </div>
        )}

        {pattern.pdf && (
          <div className="mt-8">
            <a
              href={mediaUrl(pattern.pdf) || "#"}
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Pattern PDF
            </a>
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/patterns"
            className="text-sm text-primary underline transition hover:text-accent"
          >
            &larr; Back to Patterns
          </Link>
        </div>
      </Container>
    </Section>
  );
}
