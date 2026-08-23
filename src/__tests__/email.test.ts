import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { sendOrderReceipt, sendOrderFailed, sendRefundNotice, sendPreOrderApproved } from "@/lib/email";

describe("email transaksional", () => {
  beforeEach(() => sendMock.mockReset());

  it("receipt berisi ref, rincian, dan total", async () => {
    await sendOrderReceipt("a@b.c", "NK-123456", 275000, "- 2x Kaos (Rp 250.000)\n- 1x Topi (Rp 25.000)");
    expect(sendMock).toHaveBeenCalledTimes(1);
    const { to, subject, text } = sendMock.mock.calls[0][0];
    expect(to).toBe("a@b.c");
    expect(subject).toContain("NK-123456");
    expect(text).toContain("Rp275.000");
    expect(text).toContain("Kaos");
  });

  it("failed/refund/approved memakai subject per jenis", async () => {
    await sendOrderFailed("a@b.c", "NK-1", "expire");
    await sendRefundNotice("a@b.c", "NK-1", "refund");
    await sendPreOrderApproved("a@b.c", "NK-1");
    const subjects = sendMock.mock.calls.map((c) => c[0].subject);
    expect(subjects[0]).toContain("Pembayaran tidak selesai");
    expect(subjects[1]).toContain("Dana dikembalikan");
    expect(subjects[2]).toContain("Pre-order disetujui");
  });

  it("approved menyertakan tautan halaman order", async () => {
    await sendPreOrderApproved("a@b.c", "NK-42");
    expect(sendMock.mock.calls[0][0].text).toContain("/profile/orders/NK-42");
  });

  it("kegagalan kirim tidak melempar (swallow error)", async () => {
    sendMock.mockRejectedValueOnce(new Error("resend down"));
    await expect(sendOrderFailed("a@b.c", "NK-1", "expire")).resolves.toBeUndefined();
  });
});