import { Container, Section } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { getFAQ } from "@/lib/payload/client";

export const metadata = {
  title: "FAQ — Nurea Knit",
  description: "Pertanyaan yang sering diajukan.",
};

export default async function FAQPage() {
  const { docs: items } = await getFAQ();

  return (
    <Section>
      <Container size="sm">
        <Heading as="h1">FAQ</Heading>
        <Text className="mt-2">
          Pertanyaan yang sering diajukan.
        </Text>

        {items.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Belum ada FAQ" />
          </div>
        ) : (
          <FAQAccordion items={items} />
        )}
      </Container>
    </Section>
  );
}
