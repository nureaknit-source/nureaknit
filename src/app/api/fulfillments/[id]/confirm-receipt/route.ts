import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { getUserSession } from "@/actions/cart";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config });

    let currentUserId: string | null = null;
    let isAdmin = false;

    try {
      const session = await getUserSession();
      currentUserId = session.id;
    } catch {
      const headersList = await headers();
      const { user } = await payload.auth({ headers: headersList });
      if (user?.role === "admin") {
        isAdmin = true;
      }
    }

    if (!currentUserId && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fulfillmentGroupId = Number(id);
    const fulfillmentGroup = await payload.findByID({
      collection: "fulfillment-groups",
      id: fulfillmentGroupId,
      overrideAccess: true,
    });

    if (!fulfillmentGroup) {
      return NextResponse.json({ error: "Fulfillment group tidak ditemukan" }, { status: 404 });
    }

    const orderId = typeof fulfillmentGroup.order === "object" ? fulfillmentGroup.order.id : fulfillmentGroup.order;
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
      overrideAccess: true,
    });

    if (!order || (!isAdmin && order.userId !== currentUserId)) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    if (fulfillmentGroup.status !== "shipped") {
      return NextResponse.json(
        { error: "Hanya bisa konfirmasi pesanan yang sedang dikirim" },
        { status: 400 }
      );
    }

    const updated = await payload.update({
      collection: "fulfillment-groups",
      id: fulfillmentGroupId,
      data: {
        status: "delivered",
      },
      overrideAccess: true,
    });

    return NextResponse.json({ ok: true, fulfillmentGroup: updated });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
