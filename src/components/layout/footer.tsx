import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-fg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl">
              Nurea Knit
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-primary-fg/80 leading-relaxed">
              Ruang kreasi pola rajut &amp; crochet, tutorial inspiratif, dan perlengkapan craft berkualitas. <em>Crafted with love for passionate makers.</em>
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs sm:text-sm font-bold tracking-wider uppercase">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-primary-fg/80">
              <li><Link href="/patterns" transitionTypes={['page']} className="transition hover:text-primary-fg">Patterns Library</Link></li>
              <li><Link href="/products" transitionTypes={['page']} className="transition hover:text-primary-fg">Shop Collection</Link></li>
              <li><Link href="/blog" transitionTypes={['page']} className="transition hover:text-primary-fg">Blog &amp; Journal</Link></li>
              <li><Link href="/reviews" transitionTypes={['page']} className="transition hover:text-primary-fg">Customer Reviews</Link></li>
              <li><Link href="/about" transitionTypes={['page']} className="transition hover:text-primary-fg">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs sm:text-sm font-bold tracking-wider uppercase">
              Bantuan &amp; Kontak
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-primary-fg/80">
              <li><Link href="/contact" transitionTypes={['page']} className="transition hover:text-primary-fg">Contact Us</Link></li>
              <li><Link href="/coaching" transitionTypes={['page']} className="transition hover:text-primary-fg">Private Coaching</Link></li>
              <li><Link href="/faq" transitionTypes={['page']} className="transition hover:text-primary-fg">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-fg/20 pt-6 text-center text-xs sm:text-sm text-primary-fg/60">
          &copy; {new Date().getFullYear()} Nurea Knit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
