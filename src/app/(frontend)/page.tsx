import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateInView } from "@/components/shared/animate-in-view";
import { ProductCard } from "@/components/features/product-card";
import { getCollection } from "@/lib/payload/client";
import { mediaUrl, difficultyLabel } from "@/lib/payload/utils";
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
      <section className="relative overflow-hidden bg-bg-surface" style={{ backgroundImage: "url('/hero-pattern.svg')", backgroundRepeat: "repeat", backgroundAttachment: "fixed" }}>
        <Container>
          <div className="flex flex-col items-center gap-8 py-16 sm:gap-10 md:gap-12 sm:py-24 lg:flex-row lg:min-h-screen lg:justify-center lg:py-0">
            <div className="flex-1">
              <div className="mx-auto max-w-xs lg:max-w-lg lg:mx-0 animate-float">
                <img
                  src="/heart-knite.svg"
                  alt="Flower Knit illustration"
                  className="h-auto w-[68vw] max-w-xs max-h-[55vh] object-contain sm:w-[62vw] sm:max-w-sm md:w-[52vw] lg:w-auto lg:max-w-lg lg:max-h-none"
                />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block animate-fade-in-up rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                Handcrafted with Love
              </span>
              <h1 className="animate-fade-in-up-d1 mt-6 font-display text-4xl text-fg-default sm:text-6xl lg:text-7xl">
                Nurea Knit
              </h1>
              <p className="animate-fade-in-up-d2 mt-4 max-w-lg text-lg leading-relaxed text-fg-secondary">
                Knitting &amp; Crochet patterns, tutorials, and inspiration
                crafted with love. Discover your next project.
              </p>
              <div className="animate-fade-in-up-d3 mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href="/patterns"
                  transitionTypes={['page']}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg shadow-md transition hover:opacity-90 active:scale-95 sm:px-8 sm:py-3.5"
                >
                  Explore Patterns
                </Link>
                <Link
                  href="/products"
                  transitionTypes={['page']}
                  className="rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-fg-default transition hover:border-accent hover:text-accent active:scale-95 sm:px-8 sm:py-3.5"
                >
                  Visit Shop
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {patterns.length > 0 && (
        <Section spacing="lg">
          <Container>
            <AnimateInView>
              <div className="flex items-end justify-between">
                <div>
                  <Heading as="h2">Featured Patterns</Heading>
                  <Text className="mt-2">Handpicked projects to inspire your next make.</Text>
                </div>
                <Link
                  href="/patterns"
                  transitionTypes={['page']}
                  className="hidden text-sm font-bold text-accent transition hover:text-primary sm:inline"
                >
                  View All &rarr;
                </Link>
              </div>
            </AnimateInView>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {patterns.map((pattern, i) => {
                const img = mediaUrl(pattern.image as Media | number | null);
                return (
                  <AnimateInView key={pattern.id} className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}>
                    <Link href={`/patterns/${pattern.slug || pattern.id}`} transitionTypes={['page']}>
                      <Card hover className="group h-full flex flex-col p-4 sm:p-6">
                        {img && (
                          <div className="-mx-4 -mt-4 mb-4 overflow-hidden rounded-t-2xl sm:-mx-6 sm:-mt-6">
                            <img
                              src={img}
                              alt=""
                              className="aspect-4/3 w-full object-cover transition duration-500 group-hover:scale-105"
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
                  </AnimateInView>
                );
              })}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/patterns"
                transitionTypes={['page']}
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
            <AnimateInView>
              <div className="flex items-end justify-between">
                <div>
                  <Heading as="h2">Shop Preview</Heading>
                  <Text className="mt-2">Tools, accessories, and goodies for your craft.</Text>
                </div>
                <Link
                  href="/products"
                  transitionTypes={['page']}
                  className="hidden text-sm font-bold text-accent transition hover:text-primary sm:inline"
                >
                  View All &rarr;
                </Link>
              </div>
            </AnimateInView>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <AnimateInView key={product.id} className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}>
                  <ProductCard product={product} priority={i === 0} showCategory={false} />
                </AnimateInView>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                transitionTypes={['page']}
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
          <AnimateInView>
            <div className="rounded-2xl bg-bg-surface p-6 text-center sm:p-12">
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
                  transitionTypes={['page']}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
                >
                  About Me
                </Link>
                <Link
                  href="/blog"
                  transitionTypes={['page']}
                  className="rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-fg-default transition hover:border-accent hover:text-accent active:scale-95"
                >
                  Read the Blog
                </Link>
              </div>
            </div>
          </AnimateInView>
        </Container>
      </Section>
    </>
  );
}


