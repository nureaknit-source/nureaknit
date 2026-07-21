import { Container, Section } from "@/components/ui/layout";
import { Heading, Text, Caption } from "@/components/ui/typography";

export default function AboutPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>About Me</Caption>
        <Heading as="h1" className="mt-2">
          Nurea Knit
        </Heading>
        <div className="mt-8 space-y-4">
          <Text>
            Welcome to Nurea Knit — a space where creativity meets craft. I
            design knitting and crochet patterns for makers who love working
            with their hands and creating something beautiful.
          </Text>
          <Text>
            Every pattern is carefully designed, tested, and written with
            clarity in mind. Whether you are a beginner picking up hooks and
            needles for the first time, or an experienced maker looking for
            your next project — there is something here for you.
          </Text>
          <Text>
            Beyond patterns, I share tutorials, tips, and inspiration through
            the blog. From yarn reviews to technique guides, my goal is to
            help you grow your skills and enjoy the process.
          </Text>
          <Text>
            Thank you for being here. Happy making!
          </Text>
        </div>
      </Container>
    </Section>
  );
}
