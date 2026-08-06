import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function ProductsLoading() {
  return (
    <Section>
      <Container>
        <div className="mb-4 flex items-center gap-3">
          <Skeleton variant="text" className="h-10 w-full flex-1" />
          <Skeleton variant="circle" className="h-10 w-10" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton variant="image" />
              <Skeleton variant="text" className="mt-3 h-4 w-3/4" />
              <Skeleton variant="text" className="mt-1 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
