import { SkeletonLoading } from "@/components/shared/skeleton-loading";

export default function BlogLoading() {
  return (
    <SkeletonLoading
      titleWidth="w-32"
      subtitleWidth="w-56"
      count={3}
      cardVariant="image"
      cardTexts={[
        { width: "w-3/4", marginTop: "mt-3" },
        { width: "w-full", marginTop: "mt-1" },
        { width: "w-1/2", marginTop: "mt-1" },
      ]}
    />
  );
}
