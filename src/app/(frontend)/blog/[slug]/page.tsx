export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">{slug}</h1>
      <p className="mt-4 text-medium-gray">Coming soon.</p>
    </div>
  );
}
