import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getPortfolioEntries } from "@/lib/payload/client";
import { mediaUrl } from "@/lib/payload/utils";
import type { Media } from "@/lib/payload/payload-types";

export const metadata = {
  title: "Portfolio — Nurea Knit",
  description: "A showcase of knitting and crochet work.",
};

export default async function PortfolioPage() {
  const { docs: entries } = await getPortfolioEntries({ limit: 50 });

  return (
    <Section>
      <Container>
        <Heading as="h1">Portfolio</Heading>
        <Text className="mt-2">A showcase of knitting and crochet work.</Text>

        {entries.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Belum ada karya" message="Portfolio akan segera hadir!" />
          </div>
        ) : (
          <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {entries.map((entry) => {
              const firstImage = entry.images?.[0]?.image
                ? mediaUrl(entry.images[0].image as Media | number)
                : null;
              return (
                <Link
                  key={entry.id}
                  href={`/portfolio/${entry.slug || entry.id}`}
                  className="mb-6 block break-inside-avoid"
                >
                  <Card hover className="overflow-hidden p-0">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt=""
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="aspect-[4/3] bg-light-gray" />
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold text-charcoal">
                        {entry.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {entry.category && (
                          <Tag variant={entry.category === "knitting" ? "sage" : "rose"}>
                            {entry.category}
                          </Tag>
                        )}
                        {entry.year && <Tag>{entry.year}</Tag>}
                      </div>
                    </div>
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
