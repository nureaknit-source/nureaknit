import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <Skeleton variant="text" className="h-8 w-32" />
      <Skeleton variant="text" className="mt-2 h-4 w-56" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton variant="image" />
            <Skeleton variant="text" className="mt-3 h-4 w-3/4" />
            <Skeleton variant="text" className="mt-1 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
