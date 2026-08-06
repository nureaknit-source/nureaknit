import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";
import { RichText } from "@/components/shared/rich-text";
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
          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <details key={item.id} className="group rounded-lg border border-border bg-bg-surface">
                <summary className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left transition hover:opacity-90">
                  <span className="font-sans text-lg font-bold text-fg-default">{item.question}</span>
                  <svg
                    className="h-5 w-5 text-fg-muted transition group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-border px-6 py-4">
                  <RichText data={item.answer} />
                </div>
              </details>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
