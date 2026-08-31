import { getPayload } from "payload";
import config from "@payload-config";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { PublicReviewList } from "@/components/reviews/PublicReviewList";

export default async function ReviewsPage() {
  const payload = await getPayload({ config });

  // 1. Fetch approved reviews
  const reviewsData = await payload.find({
    collection: "reviews",
    where: { status: { equals: "approved" } },
    sort: "-createdAt",
    limit: 100,
    overrideAccess: true,
  });

  // 2. Fetch unique product details needed for review display
  const productIds = Array.from(new Set(reviewsData.docs.map((r) => Number(r.product))));
  const products = await payload.find({
    collection: "products",
    where: { id: { in: productIds } },
    limit: 100,
    overrideAccess: true,
  });

  const productMap = new Map(products.docs.map((p) => [p.id, p.title]));

  // 3. Map reviews with product titles
  const reviews = reviewsData.docs.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    userName: r.userName || undefined,
    userEmail: r.userEmail,
    productTitle: productMap.get(Number(r.product)),
  }));

  return (
    <Section>
      <Container size="md">
        <Heading as="h1" className="text-center">
          Customer Stories &amp; Reviews
        </Heading>
        <Text className="text-center mt-2">
          Cerita jujur dan pengalaman hangat dari para <em>maker</em> yang telah mencoba pola &amp; produk Nurea Knit.
        </Text>
        
        <PublicReviewList reviews={reviews} />
      </Container>
    </Section>
  );
}
