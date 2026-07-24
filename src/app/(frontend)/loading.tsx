import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function FrontendLoading() {
  return (
    <Section>
      <Container>
      <Skeleton variant="text" className="h-8 w-64" />
      <Skeleton variant="text" className="mt-2 h-4 w-96" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton variant="card" />
            <Skeleton variant="text" className="mt-3 h-4 w-3/4" />
            <Skeleton variant="text" className="mt-1 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Container>
  </Section>
  );
}
