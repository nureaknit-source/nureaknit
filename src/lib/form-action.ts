import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

export interface ActionResult {
  success: boolean;
  errors?: { field: string; message: string }[];
}

export async function submitFormAction(
  collection: string,
  validate: (data: Record<string, string>) => { field: string; message: string }[],
  sendEmail: (data: Record<string, string>) => Promise<void>,
  revalidate: string,
  data: Record<string, string>,
): Promise<ActionResult> {
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
