import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "api.sandbox.midtrans.com",
  "api.sandbox.veritrans.co.id",
  "api.midtrans.com",
  "api.veritrans.co.id",
]);

export const runtime = "nodejs";
export const maxDuration = 15;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("invalid url", { status: 400 });
  }

  if (parsed.protocol !== "https:") return new NextResponse("only https allowed", { status: 400 });
  if (!ALLOWED_HOSTS.has(parsed.host)) return new NextResponse("host not allowed", { status: 400 });

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), { method: "GET" });
  } catch {
    return new NextResponse("upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok) return new NextResponse("upstream error", { status: 502 });

  const contentType = upstream.headers.get("content-type") || "image/png";
  const arrayBuffer = await upstream.arrayBuffer();
  if (arrayBuffer.byteLength > 2_000_000) {
    // ~1MB guard against oversized payloads
    return new NextResponse("payload too large", { status: 413 });
  }

  const ref = parsed.pathname.split("/").pop()?.split(".")[0]?.slice(0, 32) || "qr";

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="qris-${ref}.png"`,
      "Cache-Control": "private, max-age=30, stale-while-revalidate=30",
    },
  });
}
