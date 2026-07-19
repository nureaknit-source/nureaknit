export function Footer() {
  return (
    <footer className="border-t border-light-gray bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Nurea Knit
            </h3>
            <p className="mt-2 text-sm text-medium-gray">
              Knitting & Crochet patterns, tutorials, and inspiration.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-charcoal">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-medium-gray">
              <li><a href="/patterns" className="transition hover:text-sage">Patterns</a></li>
              <li><a href="/blog" className="transition hover:text-sage">Blog</a></li>
              <li><a href="/products" className="transition hover:text-sage">Shop</a></li>
              <li><a href="/about" className="transition hover:text-sage">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-charcoal">
              Kontak
            </h4>
            <ul className="space-y-2 text-sm text-medium-gray">
              <li><a href="/contact" className="transition hover:text-sage">Contact</a></li>
              <li><a href="/coaching" className="transition hover:text-sage">Coaching</a></li>
              <li><a href="/faq" className="transition hover:text-sage">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-light-gray pt-6 text-center text-sm text-medium-gray">
          &copy; {new Date().getFullYear()} Nurea Knit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
