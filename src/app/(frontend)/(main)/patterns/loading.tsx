import { SkeletonLoading } from "@/components/shared/skeleton-loading";

export default function PatternsLoading() {
  return (
    <SkeletonLoading
      titleWidth="w-48"
      subtitleWidth="w-72"
      count={6}
    />
  );
}
