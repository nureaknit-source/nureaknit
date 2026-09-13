import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <Section>
      <Container size="sm">
        <Skeleton variant="text" className="h-8 w-32" />
        <Skeleton variant="text" className="mt-2 h-4 w-56" />

        <div className="mt-8">
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton variant="circle" className="h-5 w-5 flex-shrink-0" />
                <Skeleton variant="text" className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
