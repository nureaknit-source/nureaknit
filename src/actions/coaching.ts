"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { validateCoaching } from "@/lib/validation";
import { sendCoachingNotification } from "@/lib/email";

interface CoachingState {
  success: boolean;
  errors?: { field: string; message: string }[];
}

export async function submitCoachingAction(
  _prevState: CoachingState,
  formData: FormData,
): Promise<CoachingState> {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };

  const errors = validateCoaching(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "coaching-requests",
      data,
    });
    void sendCoachingNotification(data);
  } catch {
    return { success: false, errors: [{ field: "form", message: "Gagal mengirim. Silakan coba lagi." }] };
  }

  revalidatePath("/coaching");
  return { success: true };
}
