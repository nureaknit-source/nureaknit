import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getUserSession } from "@/actions/cart";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const order = searchParams.get("order");
    const product = searchParams.get("product");

    if (!order || !product) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await getPayload({ config });
    const existingReviews = await payload.find({
      collection: "reviews",
      where: {
        and: [
          { userId: { equals: user.id } },
          { order: { equals: Number(order) } },
          { product: { equals: Number(product) } },
        ],
      },
      overrideAccess: true,
    });

    return NextResponse.json({ review: existingReviews.docs[0] || null });
  } catch {
    return NextResponse.json({ error: "Gagal memuat ulasan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { product, order, rating, comment } = await req.json();

    if (!product || !order || !rating || !comment) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: "Anda harus login terlebih dahulu" }, { status: 401 });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating harus antara 1 sampai 5" }, { status: 400 });
    }

    const orderId = Number(order);
    const productId = Number(product);

    const orderDoc = await payload.findByID({
      collection: "orders",
      id: orderId,
      overrideAccess: true,
    });

    const fulfillmentGroups = await payload.find({
      collection: "fulfillment-groups",
      where: { order: { equals: orderId } },
      overrideAccess: true,
      limit: 100,
    });

    const isOwner = (orderDoc as { userId: string }).userId === user.id;
    const hasDelivered = fulfillmentGroups.docs.some((g: { status: string }) => g.status === "delivered");
    const isFulfilled = (orderDoc as { status: string }).status === "fulfilled" || hasDelivered;

    if (!isOwner || !isFulfilled) {
      return NextResponse.json(
        { error: "Anda hanya dapat mengulas produk dari pesanan yang telah selesai." },
        { status: 403 },
      );
    }

    const existingReviews = await payload.find({
      collection: "reviews",
      where: {
        and: [
          { userId: { equals: user.id } },
          { order: { equals: orderId } },
          { product: { equals: productId } },
        ],
      },
      overrideAccess: true,
    });

    let review;
    if (existingReviews.docs.length > 0) {
      review = await payload.update({
        collection: "reviews",
        id: existingReviews.docs[0].id,
        data: {
          rating: numRating,
          comment: String(comment),
        },
        overrideAccess: true,
      });
    } else {
      review = await payload.create({
        collection: "reviews",
        data: {
          product: productId,
          order: orderId,
          userId: user.id,
          userEmail: user.email,
          rating: numRating,
          comment: String(comment),
          status: "pending",
        },
        overrideAccess: true,
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
