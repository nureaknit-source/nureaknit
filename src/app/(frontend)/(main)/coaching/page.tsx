import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { CoachingForm } from "./coaching-form";

export const metadata = {
  title: "Private Coaching — Nurea Knit",
  description: "One-on-one private knitting and crochet coaching.",
};

export default function CoachingPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>Private Coaching</Caption>
        <Heading as="h1" className="mt-2">
          One-on-One Coaching
        </Heading>
        <Text className="mt-2">
          Ingin belajar merajut (<em>knitting</em> atau <em>crochet</em>) secara lebih intensif dan terarah? Yuk, ikuti sesi <em>offline coaching</em> privat bersama kami. Cukup isi form di bawah untuk mendiskusikan jadwal dan teknik yang ingin kamu pelajari.
        </Text>

        <CoachingForm />
      </Container>
    </Section>
  );
}
