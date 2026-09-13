import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact Us — Nurea Knit",
  description: "Get in touch with Nurea Knit for inquiries, collaborations, and pattern help.",
};

export default function ContactPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>Contact Us</Caption>
        <Heading as="h1" className="mt-2">
          Let&apos;s Get in Touch!
        </Heading>
        <Text className="mt-2">
          Punya pertanyaan seputar pola, pesanan, atau ingin mengajak kerja sama seru? <em>Feel free to drop a message.</em> Kami akan dengan senang hati menyapamu kembali!
        </Text>

        <ContactForm />
      </Container>
    </Section>
  );
}
