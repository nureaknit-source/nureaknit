"use server";

import { submitFormAction } from "@/lib/form-action";
import { validateCoaching } from "@/lib/validation";
import { sendCoachingNotification } from "@/lib/email";

export async function submitCoachingAction(
  _prevState: { success: boolean; errors?: { field: string; message: string }[] },
  formData: FormData,
) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };
  return submitFormAction("coaching-requests", validateCoaching, sendCoachingNotification, "/coaching", data);
}
