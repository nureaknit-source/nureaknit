import { Container, Section } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";
import { getPortfolioEntries } from "@/lib/payload/client";
import { mediaUrl } from "@/lib/payload/utils";
import { PortfolioGrid } from "@/features/portfolio/portfolio-grid";
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
          <PortfolioGrid
            entries={entries.map((entry) => ({
              id: entry.id,
              title: entry.title,
              slug: entry.slug,
              category: entry.category,
              year: entry.year,
              images: (entry.images || []).map((img) => ({
                url: mediaUrl(img.image as Media | number) || "",
                alt: "",
              })).filter((img) => img.url),
            }))}
          />
        )}
      </Container>
    </Section>
  );
}
