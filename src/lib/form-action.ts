import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { checkRateLimit, getClientIp, rateLimitKey } from "@/lib/rate-limit";

interface ActionResult {
  success: boolean;
  errors?: { field: string; message: string }[];
}

interface SubmitFormOptions {
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
}

export async function submitFormAction(
  collection: string,
  validate: (data: Record<string, string>) => { field: string; message: string }[],
  sendEmail: (data: Record<string, string>) => Promise<void>,
  revalidate: string,
  data: Record<string, string>,
  options: SubmitFormOptions = {},
): Promise<ActionResult> {
  const { rateLimitMax = 5, rateLimitWindowMs = 60_000 } = options;

  const ip = getClientIp(await headers());
  const key = rateLimitKey(ip, collection);
  if (!checkRateLimit(key, rateLimitMax, rateLimitWindowMs)) {
    return { success: false, errors: [{ field: "form", message: "Terlalu banyak permintaan. Coba lagi nanti." }] };
  }

  const errors = validate(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({ collection: collection as any, data });
    void sendEmail(data);
  } catch {
    return { success: false, errors: [{ field: "form", message: "Gagal mengirim. Silakan coba lagi." }] };
  }

  revalidatePath(revalidate);
  return { success: true };
}
