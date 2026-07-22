export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <div className="h-8 w-32 animate-pulse rounded bg-light-gray" />
      <div className="mt-8 animate-pulse space-y-6">
        <div className="h-6 w-48 rounded bg-light-gray" />
        <div className="h-32 rounded bg-light-gray" />
        <div className="h-6 w-48 rounded bg-light-gray" />
        <div className="h-40 rounded bg-light-gray" />
      </div>
    </div>
  );
}
