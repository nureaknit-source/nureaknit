"use server";

import { sendWelcomeEmail } from "@/lib/email";

export async function sendWelcomeEmailAction(email: string, name: string) {
  await sendWelcomeEmail(email, name);
}
