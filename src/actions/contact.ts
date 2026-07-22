"use server";

import { submitFormAction } from "@/lib/form-action";
import { validateContact } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";

export async function submitContactAction(
  _prevState: { success: boolean; errors?: { field: string; message: string }[] },
  formData: FormData,
) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };
  return submitFormAction("contact-messages", validateContact, sendContactNotification, "/contact", data);
}
