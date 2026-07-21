import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getBlogPosts } from "@/lib/payload/client";
import { mediaUrl, formatDate } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/payload-types";

export const metadata = {
  title: "Blog — Nurea Knit",
  description: "Knitting and crochet tutorials, tips, and inspiration.",
};

export default async function BlogPage() {
  const { docs: posts } = await getBlogPosts({ limit: 20 });

  return (
    <Section>
      <Container>
        <Heading as="h1">Blog</Heading>
        <Text className="mt-2">Tutorials, tips, and inspiration.</Text>

        {posts.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Belum ada artikel" message="Blog akan segera hadir!" />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const img = mediaUrl(post.coverImage as Media | number | null);
              return (
                <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                  <Card hover className="h-full flex flex-col">
                    {img && (
                      <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                        <img
                          src={img}
                          alt=""
                          className="aspect-[16/9] w-full object-cover transition duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.featured && <Tag variant="gold">Featured</Tag>}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <Text size="sm" className="mt-1 line-clamp-3">
                        {post.excerpt}
                      </Text>
                    )}
                    {post.publishedAt && (
                      <Text size="sm" className="mt-auto pt-4">
                        {formatDate(post.publishedAt)}
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
