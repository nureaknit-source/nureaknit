import Link from "next/link";
import { HeartHandshake, GraduationCap, Leaf, Users } from "lucide-react";
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

const valueItems = [
  {
    title: "Crafted with Love",
    copy: "Setiap pola dirancang teliti dan telah diuji coba — mudah dipahami dari pemula hingga yang berpengalaman.",
    icon: HeartHandshake,
  },
  {
    title: "Beginner-Friendly",
    copy: "Panduan bertahap (step-by-step) dengan instruksi jelas — anti bingung saat mulai merajut project pertamamu.",
    icon: GraduationCap,
  },
  {
    title: "Quality & Sustainable",
    copy: "Rekomendasi benang dan alat pilihan yang awet, ramah lingkungan, dan nyaman di tangan.",
    icon: Leaf,
  },
  {
    title: "Maker Community",
    copy: "Ruang berbagi karya, tips, dan saling menyemangati bersama sesama pecinta rajut.",
    icon: Users,
  },
];

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
          <div className="flex flex-col items-center gap-0 py-10 sm:gap-10 md:gap-12 sm:py-24 lg:flex-row min-h-screen lg:justify-center lg:py-0">
            <div className="mt-6 lg:mt-0 lg:order-2 lg:flex-1">
              <div className="mx-auto max-w-xs lg:max-w-lg lg:mx-0 animate-float">
                <img
                  src="/heart-knite.svg"
                  alt="Flower Knit illustration"
                  className="h-auto w-[55vw] max-w-xs max-h-[55vh] object-contain sm:w-[62vw] sm:max-w-sm md:w-[52vw] lg:w-auto lg:max-w-lg lg:max-h-none"
                />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block animate-fade-in-up rounded-full bg-accent-subtle px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                Handcrafted with Love
              </span>
              <h1 className="animate-fade-in-up-d1 mt-6 font-display text-4xl sm:text-6xl lg:text-7xl text-fg-default leading-[1.15]">
                Nurea Knit
              </h1>
              <p className="animate-fade-in-up-d2 mt-4 max-w-lg text-base sm:text-lg md:text-xl leading-relaxed text-fg-secondary">
                Koleksi pola rajut &amp; crochet estetik, panduan praktis, dan inspirasi hangat untuk setiap kreasimu. <em>Let&apos;s make something beautiful today!</em>
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
                  <Text className="mt-2">Pilihan pola favorit untuk temani waktu luang dan eksplorasi kreasimu.</Text>
                </div>
                <Link
                  href="/patterns"
                  transitionTypes={['page']}
                  className="hidden text-sm font-bold text-accent transition hover:text-primary sm:inline"
                >
                  Lihat Semua Pola &rarr;
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
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                          {pattern.difficulty && (
                            <Badge variant="primary">{difficultyLabel(pattern.difficulty)}</Badge>
                          )}
                          {pattern.featured && <Badge variant="accent">Featured</Badge>}
                        </div>
                        <h3 className="font-sans text-base sm:text-lg font-bold text-fg-default line-clamp-2">
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
                Lihat Semua Pola &rarr;
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
                  <Heading as="h2">Shop Collection</Heading>
                  <Text className="mt-2">Produk berkualitas, alat rajut, dan perlengkapan esensial untuk craft terbaikmu.</Text>
                </div>
                <Link
                  href="/products"
                  transitionTypes={['page']}
                  className="hidden text-sm font-bold text-accent transition hover:text-primary sm:inline"
                >
                  Lihat Semua Produk &rarr;
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
                Lihat Semua Produk &rarr;
              </Link>
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="lg" className="bg-primary">
        <Container>
          <AnimateInView>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valueItems.map((item, i) => (
                <AnimateInView key={item.title} className={`animate-fade-in-up-d${Math.min(i + 1, 3)}`}>
                  <Card hover className="flex h-full flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-primary-subtle p-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Heading as="h3" className="text-lg font-bold sm:text-xl">
                      {item.title}
                    </Heading>
                    <Text size="sm" className="mt-2">
                      {item.copy}
                    </Text>
                  </Card>
                </AnimateInView>
              ))}
            </div>
          </AnimateInView>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="sm">
          <AnimateInView>
            <div className="rounded-2xl bg-bg-surface p-6 text-center sm:p-12">
              <Heading as="h2" display className="text-3xl sm:text-4xl">
                Let&apos;s Create Something Together!
              </Heading>
              <Text className="mt-4 max-w-md mx-auto">
                Setiap helai benang punya cerita. Mau baru pertama kali belajar memegang hakpen atau sudah mahir membuat berbagai project, selalu ada kreasi seru yang siap dieksplorasi bersama.
              </Text>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/about"
                  transitionTypes={['page']}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-fg transition hover:opacity-90 active:scale-95"
                >
                  Tentang Kami (About Us)
                </Link>
                <Link
                  href="/blog"
                  transitionTypes={['page']}
                  className="rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-fg-default transition hover:border-accent hover:text-accent active:scale-95"
                >
                  Baca Blog &amp; Tutorial
                </Link>
              </div>
            </div>
          </AnimateInView>
        </Container>
      </Section>
    </>
  );
}


