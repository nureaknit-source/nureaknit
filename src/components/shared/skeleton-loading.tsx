import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function SkeletonLoading({
  titleWidth = "w-48",
  subtitleWidth = "w-72",
  count = 3,
  cardVariant = "card",
  cardTexts = [
    { width: "w-3/4", marginTop: "mt-3" },
    { width: "w-1/2", marginTop: "mt-1" },
  ],
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  count?: number;
  cardVariant?: "text" | "card" | "image" | "circle";
  cardTexts?: { width?: string; marginTop?: string }[];
}) {
  return (
    <Section>
      <Container>
        <Skeleton variant="text" className={`h-8 ${titleWidth}`} />
        <Skeleton variant="text" className={`mt-2 h-4 ${subtitleWidth}`} />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>
              <Skeleton variant={cardVariant} />
              {cardTexts.map((t, j) => (
                <Skeleton
                  key={j}
                  variant="text"
                  className={`${t.marginTop || "mt-1"} h-4 ${t.width || "w-full"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
