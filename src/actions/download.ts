"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Pattern, Download } from "@/lib/payload/payload-types";

async function getUserEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}

export async function downloadPatternAction(formData: FormData): Promise<void> {
  const email = await getUserEmail();
  if (!email) {
    redirect("/login?redirect=/patterns");
  }

  const patternId = Number(formData.get("patternId"));
  if (!patternId) {
    redirect("/patterns?error=invalid-id");
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "patterns",
    where: { id: { equals: patternId } },
    limit: 1,
    depth: 2,
  });

  if (result.docs.length === 0) {
    redirect("/patterns?error=not-found");
  }

  const pattern = result.docs[0] as Pattern;

  // ponytail: log download for history tracking (awaited before redirect so history is durable)
  await payload.create({
    collection: "downloads",
    data: {
      userEmail: email,
      pattern: patternId,
      downloadedAt: new Date().toISOString(),
    },
  });

  const pdf = pattern?.pdf;
  if (!pdf) {
    redirect(`/patterns/${pattern.slug || pattern.id}?error=no-pdf`);
  }

  const url = typeof pdf === "object" ? String(pdf.url || "") : String(pdf);
  if (!url) {
    redirect(`/patterns/${pattern.slug || pattern.id}?error=no-url`);
  }

  redirect(url);
}

export async function getDownloadsAction(): Promise<
  { id: number; title: string; slug: string; downloadedAt: string }[]
> {
  const email = await getUserEmail();
  if (!email) return [];

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "downloads",
    where: { userEmail: { equals: email } },
    sort: "-downloadedAt",
    depth: 2,
  });

  return docs.map((d: Download) => {
    const pattern = typeof d.pattern === "object" ? d.pattern : undefined;
    return {
      id: pattern?.id ?? 0,
      title: pattern?.title || "Untitled",
      slug: pattern?.slug || String(pattern?.id || 0),
      downloadedAt: d.downloadedAt || "",
    };
  });
}
