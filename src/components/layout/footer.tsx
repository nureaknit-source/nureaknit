import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-fg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg">
              Nurea Knit
            </h3>
            <p className="mt-2 text-sm text-primary-fg/70">
              Knitting & Crochet patterns, tutorials, and inspiration.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-primary-fg/70">
              <li><Link href="/patterns" transitionTypes={['page']} className="transition hover:text-primary-fg">Patterns</Link></li>
              <li><Link href="/blog" transitionTypes={['page']} className="transition hover:text-primary-fg">Blog</Link></li>
              <li><Link href="/products" transitionTypes={['page']} className="transition hover:text-primary-fg">Shop</Link></li>
              <li><Link href="/about" transitionTypes={['page']} className="transition hover:text-primary-fg">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold">
              Kontak
            </h4>
            <ul className="space-y-2 text-sm text-primary-fg/70">
              <li><Link href="/contact" transitionTypes={['page']} className="transition hover:text-primary-fg">Contact</Link></li>
              <li><Link href="/coaching" transitionTypes={['page']} className="transition hover:text-primary-fg">Coaching</Link></li>
              <li><Link href="/faq" transitionTypes={['page']} className="transition hover:text-primary-fg">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-fg/20 pt-6 text-center text-sm text-primary-fg/50">
          &copy; {new Date().getFullYear()} Nurea Knit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
