"use server";

import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import type { UserProfile } from "@/lib/payload/payload-types";

export async function getProfileAction(): Promise<{ name: string; email: string }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return { name: "", email: "" };

  const payload = await getPayload({ config });
  const profiles = await payload.find({
    collection: "user-profiles",
    where: { supabaseId: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  });

  const profile = profiles.docs[0] as UserProfile | undefined;
  return {
    name: (profile?.displayName as string) || user.user_metadata?.name || "",
    email: (profile?.email as string) || user.email || "",
  };
}

export async function upsertUserProfile({
  supabaseId,
  email,
  displayName,
}: {
  supabaseId: string;
  email: string;
  displayName: string;
}): Promise<void> {
  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "user-profiles",
    where: { supabaseId: { equals: supabaseId } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs.length > 0) {
    await payload.update({
      collection: "user-profiles",
      id: existing.docs[0].id,
      data: { displayName, email },
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "user-profiles",
      data: { supabaseId, email, displayName },
      overrideAccess: true,
    });
  }
}

export async function updateProfileNameAction(
  name: string,
): Promise<{ ok: boolean; error?: string }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return { ok: false, error: "Unauthorized" };

  const displayName = name.trim();
  await upsertUserProfile({
    supabaseId: user.id,
    email: user.email || "",
    displayName,
  });

  await supabase.auth.updateUser({ data: { name: displayName } });

  revalidatePath("/profile/settings");
  revalidatePath("/profile");
  return { ok: true };
}
