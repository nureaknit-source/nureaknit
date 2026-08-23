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

export async function sendAdminNotification(subject: string, text: string) {
  await sendEmail("nureaknit@gmail.com", subject, text);
}

export async function sendOrderReceipt(to: string, orderRef: string, total: number, lines: string) {
  await sendEmail(
    to,
    `[Nurea Knit] Pembayaran diterima — ${orderRef}`,
    `Pembayaran untuk order ${orderRef} sudah kami terima.\n\n${lines}\n\nTotal: Rp${total.toLocaleString("id-ID")}\n\nTerima kasih!\nNurea Knit`,
  );
}

export async function sendOrderFailed(to: string, orderRef: string, reason: string) {
  await sendEmail(
    to,
    `[Nurea Knit] Pembayaran tidak selesai — ${orderRef}`,
    `Pembayaran untuk order ${orderRef} belum selesai (${reason}) sehingga dibatalkan.\n\nHubungi kami bila perlu bantuan.\nNurea Knit`,
  );
}

export async function sendRefundNotice(to: string, orderRef: string, status: string) {
  await sendEmail(
    to,
    `[Nurea Knit] Dana dikembalikan — ${orderRef}`,
    `Status ${status} tercatat untuk order ${orderRef}.\n\nDana akan dikembalikan ke metode pembayaran awal Anda.\nNurea Knit`,
  );
}

export async function sendPreOrderApproved(to: string, orderRef: string) {
  await sendEmail(
    to,
    `[Nurea Knit] Pre-order disetujui — ${orderRef}`,
    `Pre-order ${orderRef} sudah disetujui dan slot Anda diamankan.\n\nSilakan selesaikan pembayaran di halaman order:\n${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/profile/orders/${orderRef}\n\nTerima kasih!\nNurea Knit`,
  );
}
