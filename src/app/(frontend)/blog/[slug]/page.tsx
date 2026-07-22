import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RichText } from "@/components/shared/rich-text";
import { getBySlug } from "@/lib/payload/client";
import { mediaUrl, formatDate } from "@/lib/payload/utils";
import type { BlogPost } from "@/lib/payload/payload-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBySlug<BlogPost>("blog-posts", slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Nurea Knit Blog`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBySlug<BlogPost>("blog-posts", slug);

  if (!post) notFound();

  const img = mediaUrl(post.coverImage);

  return (
    <Section>
      <Container size="md">
        <Breadcrumbs
          crumbs={[
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        {img && (
          <div className="overflow-hidden rounded-xl">
            <img src={img} alt="" className="aspect-[16/9] w-full object-cover" />
          </div>
        )}

        <div className="mt-8">
          <Caption>Blog</Caption>
          <Heading as="h1" className="mt-2">
            {post.title}
          </Heading>
          {post.publishedAt && (
            <Text size="sm" className="mt-4">
              {formatDate(post.publishedAt)}
            </Text>
          )}
        </div>

        {post.excerpt && (
          <p className="mt-6 text-lg text-medium-gray leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div className="mt-8">
            <RichText data={post.content} />
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/blog"
            className="text-sm text-sage underline transition hover:text-terracotta"
          >
            &larr; Back to Blog
          </Link>
        </div>
      </Container>
    </Section>
  );
}
