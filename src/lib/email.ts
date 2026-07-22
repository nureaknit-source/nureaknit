import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Nurea Knit <onboarding@resend.dev>";

async function sendEmail(to: string, subject: string, text: string) {
  try {
    await resend.emails.send({ from: FROM, to, subject, text });
  } catch (e) {
    console.error("sendEmail failed:", e);
  }
}

export async function sendContactNotification(data: Record<string, string>) {
  await sendEmail("nureaknit@gmail.com", `[Contact] ${data.subject}`, `From: ${data.name} (${data.email})\n\n${data.message}`);
}

export async function sendCoachingNotification(data: Record<string, string>) {
  await sendEmail("nureaknit@gmail.com", `[Coaching] New request from ${data.name}`, `From: ${data.name} (${data.email})\n\n${data.message}`);
}

export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail(email, "Welcome to Nurea Knit!", `Hi ${name},\n\nWelcome to Nurea Knit! Happy crafting.\n\nBest,\nNurea Knit Team`);
}
