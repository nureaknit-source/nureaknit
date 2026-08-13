import { SkeletonLoading } from "@/components/shared/skeleton-loading";

export default function FrontendLoading() {
  return (
    <SkeletonLoading
      titleWidth="w-64"
      subtitleWidth="w-96"
      count={3}
    />
  );
}
