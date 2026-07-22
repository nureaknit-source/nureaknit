"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { validateContact } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";

interface ContactState {
  success: boolean;
  errors?: { field: string; message: string }[];
}

export async function submitContactAction(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const errors = validateContact(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "contact-messages",
      data,
    });
    void sendContactNotification(data);
  } catch {
    return { success: false, errors: [{ field: "form", message: "Gagal mengirim pesan. Silakan coba lagi." }] };
  }

  revalidatePath("/contact");
  return { success: true };
}
