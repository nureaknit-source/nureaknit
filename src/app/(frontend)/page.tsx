export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <section className="text-center max-w-2xl">
        <p className="font-handwriting text-gold text-2xl mb-4">
          Welcome to
        </p>
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-charcoal sm:text-6xl">
          Nurea Knit
        </h1>
        <p className="mt-6 text-lg text-medium-gray leading-relaxed">
          Knitting & Crochet patterns, tutorials, and inspiration
          crafted with love. Discover your next project.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="/patterns"
            className="rounded-lg bg-sage px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Explore Patterns
          </a>
          <a
            href="/about"
            className="rounded-lg border border-light-gray px-6 py-3 text-sm font-medium text-charcoal transition hover:border-sage hover:text-sage"
          >
            About Me
          </a>
        </div>
      </section>
    </div>
  );
}
