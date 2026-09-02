import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Kebijakan Pengembalian & Pembatalan — Nurea Knit",
  description: "Ketentuan retur barang fisik, garansi unboxing, pembatalan pesanan, dan pengembalian dana (refund) di Nurea Knit.",
};

export default function RefundPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>Legalitas &amp; Kebijakan</Caption>
        <Heading as="h1" display className="mt-2 text-3xl sm:text-4xl text-fg-default">
          Kebijakan Pengembalian &amp; Refund
        </Heading>
        <Text size="sm" className="mt-2 text-fg-muted">
          Terakhir diperbarui: September 2026
        </Text>

        <div className="mt-8 space-y-8 text-fg-secondary">
          <div>
            <Text className="leading-relaxed">
              Kepuasan dan kenyamanan Anda adalah prioritas utama di <strong>Nurea Knit</strong>. Kami senantiasa memastikan setiap produk yang dikirimkan telah melalui tahap pemeriksaan kualitas (quality control) yang cermat. Namun jika Anda menerima produk yang tidak sesuai atau mengalami kerusakan, kami menyediakan kebijakan pengembalian barang (<em>return</em>) dan pengembalian dana (<em>refund</em>) yang transparan.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              1. Ketentuan Retur Produk Fisik (Ready Stock)
            </Heading>
            <Text className="text-sm leading-relaxed">
              Pengembalian atau penukaran barang fisik ready stock dapat diajukan jika memenuhi kriteria berikut:
            </Text>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Cacat Produksi / Rusak:</strong> Produk diterima dalam kondisi rusak parah akibat kelalaian produksi (misal: rajutan terurai rusak berat atau komponen penting hilang).
              </li>
              <li>
                <strong>Salah Kirim:</strong> Produk, warna, atau varian yang diterima berbeda dengan rincian pesanan pada faktur.
              </li>
              <li>
                <strong>Kondisi Produk:</strong> Produk belum pernah dipakai, belum dicuci, label/tag merek masih terpasang rapi, dan kemasan asli masih utuh.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              2. Syarat Wajib: Video Unboxing
            </Heading>
            <div className="rounded-lg border border-warning/40 bg-warning-subtle/30 p-4">
              <Text className="text-sm leading-relaxed font-medium text-fg-default">
                ⚠️ Penting: Setiap klaim kerusakan atau barang kurang wajib menyertakan <strong>Video Unboxing Lengkap</strong> tanpa jeda (tanpa jeda/edit/cut) sejak paket pertama kali dibuka dari bungkus kurir hingga pengecekan fisik produk.
              </Text>
            </div>
            <Text className="text-sm leading-relaxed">
              Batas waktu pelaporan komplain adalah maksimal <strong>1 x 24 jam</strong> sejak status paket diterima berdasarkan data pelacakan kurir ekspedisi. Komplain tanpa bukti video unboxing mohon maaf tidak dapat diproses.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              3. Ketentuan Produk Pre-Order (Made-to-Order)
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Produk pre-order merupakan barang rajutan tangan eksklusif yang dibuat khusus sesuai pesanan Anda (<em>custom handmade</em>).
              </li>
              <li>
                Pembatalan pesanan pre-order hanya dapat dilakukan maksimal <strong>12 jam</strong> setelah pembayaran terverifikasi. Setelah melewati waktu tersebut, benang dan bahan telah disiapkan dan proses pengerjaan telah dimulai sehingga pesanan tidak dapat dibatalkan secara sepihak.
              </li>
              <li>
                Retur pada pesanan pre-order hanya berlaku jika terjadi kesalahan fatal dari pihak kami atau produk tidak sesuai spesifikasi yang disepakati.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              4. Ketentuan Pola Digital (Pattern PDF)
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Produk berupa dokumen digital (file PDF pola rajut) yang dapat langsung diunduh setelah pembayaran berhasil bersifat <strong>FINAL dan NON-REFUNDABLE</strong> (tidak dapat dikembalikan atau dibatalkan).
              </li>
              <li>
                Jika Anda mengalami kendala teknis saat mengunduh file atau file rusak/korup, silakan hubungi kami dengan melampirkan nomor pesanan Anda, dan kami akan segera mengirimkan tautan unduhan baru atau file pola langsung ke email Anda.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              5. Mekanisme &amp; Waktu Pengembalian Dana (Refund)
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Setelah barang retur fisik diterima kembali oleh tim Nurea Knit dan lolos tahap verifikasi kondisi, proses pengembalian dana akan segera diproses.
              </li>
              <li>
                Pengembalian dana akan ditransfer kembali ke rekening bank pemesan atau saldo metode pembayaran asal dalam waktu <strong>3 – 5 hari kerja</strong>.
              </li>
              <li>
                Ongkos kirim pengembalian barang rusak karena kesalahan kirim dari pihak kami akan diganti penuh oleh Nurea Knit.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-2">
            <Heading as="h4" className="text-fg-default">
              Cara Mengajukan Retur / Pengembalian
            </Heading>
            <Text size="sm">
              Untuk memulai pengajuan, silakan hubungi kami dengan menyertakan <strong>Nomor Order (Reference ID)</strong>, deskripsi kendala, dan video unboxing melalui WhatsApp Admin kami atau halaman{" "}
              <Link href="/contact" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
                Hubungi Kami
              </Link>.
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}
