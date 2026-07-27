import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateInView } from "@/components/shared/animate-in-view";
import { EmptyState } from "@/components/shared/empty-state";
import { getCollection } from "@/lib/payload/client";
import { mediaUrl, formatDate } from "@/lib/payload/utils";
import type { Media, BlogPost } from "@/lib/payload/payload-types";

export const metadata = {
  title: "Blog — Nurea Knit",
  description: "Knitting and crochet tutorials, tips, and inspiration.",
};

export default async function BlogPage() {
  const { docs: posts } = await getCollection<BlogPost>("blog-posts");

  return (
    <Section>
      <Container>
        <Heading as="h1">Blog</Heading>
        <Text className="mt-2">Tutorials, tips, and inspiration.</Text>

        {posts.length === 0 ? (
          <div className="mt-12">
            <AnimateInView><EmptyState title="Belum ada artikel" message="Blog akan segera hadir!" /></AnimateInView>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const img = mediaUrl(post.coverImage as Media | number | null);
              return (
                <AnimateInView key={post.id} className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}>
                  <Link href={`/blog/${post.slug || post.id}`} transitionTypes={['page']}>
                    <Card hover className="h-full flex flex-col">
                      {img && (
                        <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
                          <img
                            src={img}
                            alt=""
                            className="aspect-[16/9] w-full object-cover transition duration-300 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.featured && <Badge variant="accent">Featured</Badge>}
                      </div>
                      <h3 className="font-sans text-lg font-bold text-fg-default">
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
                </AnimateInView>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
