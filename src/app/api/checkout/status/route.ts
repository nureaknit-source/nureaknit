import { getPayload } from "payload";
import config from "@payload-config";
import { getUserSession } from "@/actions/cart";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");
  if (!ref) return Response.json({ error: "missing ref" }, { status: 400 });

  try {
    const { id: userId } = await getUserSession();
    if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

    const payload = await getPayload({ config });
    const found = await payload.find({
      collection: "orders",
      where: { reference: { equals: ref }, userId: { equals: userId } },
      limit: 1,
    });
    const order = found.docs[0];
    if (!order) return Response.json({ error: "not found" }, { status: 404 });

    return Response.json({
      status: order.status,
      orderId: order.id,
      expiresAt: order.expiresAt ?? null,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
    return Response.json({ error: "internal" }, { status: 500 });
  }
}
