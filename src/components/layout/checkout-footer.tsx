import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function CheckoutFooter() {
  const waNumber = process.env.NEXT_PUBLIC_WA_ADMIN_NUMBER;

  return (
    <footer className="mt-auto border-t border-border bg-bg-surface py-6 text-xs text-fg-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                "Halo Nurea Knit, saya butuh bantuan terkait checkout / pembayaran.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Butuh Bantuan? Chat WhatsApp</span>
            </a>
          )}
          <span className="hidden text-border sm:inline">&bull;</span>
          <Link href="/refund" className="hover:text-fg-default hover:underline">
            Kebijakan Retur &amp; Pengembalian
          </Link>
          <span className="hidden text-border sm:inline">&bull;</span>
          <Link href="/terms" className="hover:text-fg-default hover:underline">
            Syarat &amp; Ketentuan
          </Link>
        </div>

        <p className="text-center sm:text-right">
          &copy; {new Date().getFullYear()} Nurea Knit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
