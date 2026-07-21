import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <Skeleton variant="text" className="h-8 w-40" />
      <Skeleton variant="text" className="mt-2 h-4 w-64" />
      <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="mb-6 break-inside-avoid">
            <Skeleton variant="card" className="h-64" />
          </div>
        ))}
      </div>
    </div>
  );
}
