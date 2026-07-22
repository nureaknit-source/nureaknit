import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { getCollection } from "@/lib/payload/client";
import type { Faq } from "@/lib/payload/payload-types";

export const metadata = {
  title: "FAQ — Nurea Knit",
  description: "Pertanyaan yang sering diajukan.",
};

export default async function FAQPage() {
  const { docs: items } = await getCollection<Faq>("faq");

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
