import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await resend.emails.send({
    from: "Nurea Knit <noreply@nureaknit.com>",
    to: "admin@nureaknit.com",
    subject: `[Contact] ${data.subject}`,
    text: `From: ${data.name} (${data.email})\n\n${data.message}`,
  });
}

export async function sendCoachingNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  await resend.emails.send({
    from: "Nurea Knit <noreply@nureaknit.com>",
    to: "admin@nureaknit.com",
    subject: `[Coaching] New request from ${data.name}`,
    text: `From: ${data.name} (${data.email})\n\n${data.message}`,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "Nurea Knit <noreply@nureaknit.com>",
    to: email,
    subject: "Welcome to Nurea Knit!",
    text: `Hi ${name},\n\nWelcome to Nurea Knit! Happy crafting.\n\nBest,\nNurea Knit Team`,
  });
}
