import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCollection } from "@/lib/payload/client";
import { mediaUrl, formatPrice, difficultyLabel } from "@/lib/payload/utils";
import type { Media, Pattern, Product } from "@/lib/payload/payload-types";

export default async function HomePage() {
  const [patternsData, productsData] = await Promise.all([
    getCollection<Pattern>("patterns", { where: { featured: { equals: true } }, limit: 3 }),
    getCollection<Product>("products", { limit: 3 }),
  ]);
  const patterns = patternsData?.docs || [];
  const products = productsData?.docs || [];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-bg-base to-surface">
        <Container>
          <div className="flex flex-col items-center gap-12 py-16 sm:py-24 lg:flex-row lg:py-32">
            <div className="flex-1">
              <div className="mx-auto max-w-lg lg:mx-0">
                <CrochetIllustration />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                Handcrafted with Love
              </span>
              <h1 className="mt-6 font-display text-5xl text-fg-default sm:text-6xl lg:text-7xl">
                Nurea Knit
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-fg-secondary">
                Knitting &amp; Crochet patterns, tutorials, and inspiration
                crafted with love. Discover your next project.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href="/patterns"
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95"
                >
                  Explore Patterns
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border-2 border-border px-8 py-3.5 text-sm font-bold text-fg-default transition hover:border-accent hover:text-accent active:scale-95"
                >
                  Visit Shop
                </Link>
              </div>
            </div>
          </div>
        </Container>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {patterns.length > 0 && (
        <Section spacing="lg">
          <Container>
            <div className="flex items-end justify-between">
              <div>
                <Heading as="h2">Featured Patterns</Heading>
                <Text className="mt-2">Handpicked projects to inspire your next make.</Text>
              </div>
              <Link
                href="/patterns"
                className="hidden text-sm font-bold text-accent transition hover:text-primary sm:inline"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {patterns.map((pattern) => {
                const img = mediaUrl(pattern.image as Media | number | null);
                return (
                  <Link key={pattern.id} href={`/patterns/${pattern.slug || pattern.id}`}>
                    <Card hover className="group h-full flex flex-col">
                      {img && (
                        <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                          <img
                            src={img}
                            alt=""
                            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {pattern.difficulty && (
                          <Badge variant="primary">{difficultyLabel(pattern.difficulty)}</Badge>
                        )}
                        {pattern.featured && <Badge variant="accent">Featured</Badge>}
                      </div>
                      <h3 className="font-sans text-lg font-bold text-fg-default">
                        {pattern.title}
                      </h3>
                      {pattern.description && (
                        <Text size="sm" className="mt-1 line-clamp-2">
                          {pattern.description}
                        </Text>
                      )}
                    </Card>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/patterns"
                className="text-sm font-bold text-accent transition hover:text-primary"
              >
                View All Patterns &rarr;
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {products.length > 0 && (
        <Section spacing="lg">
          <Container>
            <div className="flex items-end justify-between">
              <div>
                <Heading as="h2">Shop Preview</Heading>
                <Text className="mt-2">Tools, accessories, and goodies for your craft.</Text>
              </div>
              <Link
                href="/products"
                className="hidden text-sm font-bold text-accent transition hover:text-primary sm:inline"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const firstImage = product.images?.[0]?.image
                  ? mediaUrl(product.images[0].image as Media | number)
                  : null;
                return (
                  <Link key={product.id} href={`/products/${product.slug || product.id}`}>
                    <Card hover className="group h-full flex flex-col">
                      {firstImage ? (
                        <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                          <img
                            src={firstImage}
                            alt=""
                            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="-mx-6 -mt-6 mb-4 aspect-[4/3] rounded-t-2xl bg-accent-subtle" />
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {product.featured && <Badge variant="accent">Featured</Badge>}
                        {product.type && (
                          <Badge variant="primary">{product.type === "digital" ? "Digital" : "Physical"}</Badge>
                        )}
                      </div>
                      <h3 className="font-sans text-lg font-bold text-fg-default">
                        {product.title}
                      </h3>
                      <Text className="mt-1 font-bold text-primary">
                        {formatPrice(product.price)}
                      </Text>
                    </Card>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="text-sm font-bold text-accent transition hover:text-primary"
              >
                View All Products &rarr;
              </Link>
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="lg">
        <Container size="sm">
          <div className="rounded-2xl bg-accent-subtle p-8 text-center sm:p-12">
            <Heading as="h2" display className="text-3xl sm:text-4xl">
              Let&apos;s Create Together
            </Heading>
            <Text className="mt-4 max-w-md mx-auto">
              Every stitch tells a story. Whether you&apos;re a beginner or a seasoned maker,
              there&apos;s always something new to learn and create.
            </Text>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/about"
                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
              >
                About Me
              </Link>
              <Link
                href="/blog"
                className="rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-fg-default transition hover:border-accent hover:text-accent active:scale-95"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function CrochetIllustration() {
  return (
    <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
      {/* Yarn ball - main body */}
      <ellipse cx="160" cy="200" rx="90" ry="85" fill="#A88569" opacity="0.15" />
      <ellipse cx="160" cy="195" rx="82" ry="78" fill="#C9A87C" opacity="0.25" />
      <circle cx="160" cy="190" r="70" fill="#E8D5C4" stroke="#A88569" strokeWidth="1.5" />
      
      {/* Yarn winding lines */}
      <path d="M100 170 Q130 140 160 145 Q190 150 200 170" stroke="#A88569" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M105 190 Q135 160 165 165 Q195 170 205 190" stroke="#A88569" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M110 210 Q140 185 165 185 Q190 185 200 210" stroke="#A88569" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M120 230 Q145 210 165 210 Q185 210 195 230" stroke="#A88569" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M135 245 Q150 235 165 235 Q180 235 185 245" stroke="#A88569" strokeWidth="1.5" fill="none" opacity="0.4" />
      
      {/* Yarn strand going up */}
      <path d="M200 170 Q220 140 230 110 Q240 80 250 60 Q260 40 280 35"
        stroke="#A88569" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Yarn strand curves */}
      <path d="M280 35 Q290 30 295 40 Q300 50 290 55" stroke="#A88569" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M290 55 Q280 60 285 70 Q290 80 300 75" stroke="#A88569" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M300 75 Q310 70 305 60" stroke="#A88569" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Crochet hook */}
      <g transform="translate(265, 55) rotate(-30)">
        <rect x="0" y="0" width="4" height="100" rx="2" fill="#73513C" opacity="0.8" />
        <path d="M0 0 Q-4 -8 0 -16 Q4 -20 8 -16 L6 -8" stroke="#73513C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Small decorative stitches */}
      <g opacity="0.3">
        <path d="M310 120 Q315 115 320 120 Q325 125 320 130" stroke="#73513C" strokeWidth="1.5" fill="none" />
        <path d="M330 140 Q335 135 340 140 Q345 145 340 150" stroke="#73513C" strokeWidth="1.5" fill="none" />
        <path d="M70 100 Q75 95 80 100" stroke="#A88569" strokeWidth="1.5" fill="none" />
        <path d="M50 130 Q55 125 60 130" stroke="#A88569" strokeWidth="1.5" fill="none" />
      </g>
      
      {/* Shadow under yarn ball */}
      <ellipse cx="160" cy="265" rx="60" ry="8" fill="#3E2A1E" opacity="0.08" />
    </svg>
  );
}
