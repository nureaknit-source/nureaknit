import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Nurea Knit",
  description: "Kebijakan privasi dan perlindungan data pribadi pelanggan di Nurea Knit.",
};

export default function PrivacyPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>Legalitas &amp; Kebijakan</Caption>
        <Heading as="h1" display className="mt-2 text-3xl sm:text-4xl text-fg-default">
          Kebijakan Privasi
        </Heading>
        <Text size="sm" className="mt-2 text-fg-muted">
          Terakhir diperbarui: September 2026
        </Text>

        <div className="mt-8 space-y-8 text-fg-secondary">
          <div>
            <Text className="leading-relaxed">
              Di <strong>Nurea Knit</strong> (<em>nureaknit.com</em>), kami sangat menghargai dan berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan menjaga informasi pribadi yang Anda berikan saat menggunakan situs kami sesuai dengan peraturan perundang-undangan perlindungan data pribadi yang berlaku di Republik Indonesia.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              1. Informasi yang Kami Kumpulkan
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Data Identitas &amp; Kontak:</strong> Nama lengkap, alamat email, dan nomor telepon / WhatsApp yang Anda masukkan saat membuat pesanan atau menghubungi kami.
              </li>
              <li>
                <strong>Data Pengiriman:</strong> Alamat pengiriman lengkap (nama jalan, nomor rumah, kecamatan, kota/kabupaten, kode pos) dan catatan khusus untuk kurir.
              </li>
              <li>
                <strong>Data Transaksi:</strong> Rincian item pesanan, total belanja, metode pembayaran yang dipilih, status transaksi, dan ID referensi pesanan. <em>(Catatan penting: Kami <strong>tidak</strong> pernah menyimpan nomor kartu kredit/debit, CVV, atau PIN perbankan Anda. Seluruh transaksi finansial diproses melalui gerbang pembayaran berizin resmi).</em>
              </li>
              <li>
                <strong>Data Teknis:</strong> Alamat IP, jenis peramban (browser), dan data log aktivitas untuk keperluan keamanan sistem dan pencegahan penipuan (fraud prevention).
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              2. Bagaimana Kami Menggunakan Informasi Anda
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>Memproses verifikasi pembayaran dan mengirimkan pesanan fisik ke alamat Anda.</li>
              <li>Memberikan akses unduhan langsung untuk produk digital (pola rajut) yang telah dibeli.</li>
              <li>Mengirimkan notifikasi status pemesanan, resi pelacakan ekspedisi, atau pembaruan pre-order via email / WhatsApp.</li>
              <li>Merespons pertanyaan, masukan, atau kendala yang Anda sampaikan kepada tim layanan pelanggan kami.</li>
              <li>Meningkatkan fungsionalitas, performa, dan kenyamanan pengguna saat berselancar di situs Nurea Knit.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              3. Berbagi Informasi dengan Pihak Ketiga
            </Heading>
            <Text className="text-sm leading-relaxed">
              Nurea Knit tidak pernah menjual, menyewakan, atau memperjualbelikan data pribadi Anda kepada pihak ketiga mana pun untuk tujuan pemasaran. Kami hanya membagikan data kepada mitra pihak ketiga resmi dalam batasan yang sangat diperlukan untuk memproses pesanan Anda:
            </Text>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Payment Gateway (Midtrans):</strong> Untuk memproses instruksi transaksi QRIS, Virtual Account, atau e-wallet secara aman dan terenkripsi.
              </li>
              <li>
                <strong>Mitra Jasa Ekspedisi / Kurir:</strong> Memberikan nama penerima, nomor kontak, dan alamat tujuan guna mengantarkan pesanan fisik sampai ke tujuan.
              </li>
              <li>
                <strong>Kepatuhan Hukum:</strong> Apabila diwajibkan oleh ketentuan hukum atau perintah resmi dari otoritas penegak hukum yang berwenang di Indonesia.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              4. Keamanan &amp; Penyimpanan Data
            </Heading>
            <Text className="text-sm leading-relaxed">
              Kami menerapkan standar keamanan teknis dan organisasi yang ketat, termasuk penggunaan protokol enkripsi <strong>SSL/HTTPS</strong> pada seluruh pertukaran data di situs web, enkripsi database, dan pembatasan akses administratif hanya untuk staf resmi yang berwenang.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              5. Penggunaan Cookie &amp; Sesi
            </Heading>
            <Text className="text-sm leading-relaxed">
              Situs kami menggunakan cookie dan teknologi penyimpanan sesi untuk menjaga keranjang belanja Anda tetap aktif, mengingat preferensi Anda, dan mengoptimalkan performa halaman. Anda dapat mengatur peramban Anda untuk menolak cookie, namun beberapa fitur (seperti keranjang belanja) mungkin memerlukan cookie sesi untuk berfungsi optimal.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              6. Hak Pengguna
            </Heading>
            <Text className="text-sm leading-relaxed">
              Anda berhak meminta informasi mengenai data pribadi Anda yang kami simpan, meminta perbaikan jika ada data yang tidak akurat, atau mengajukan permohonan penghapusan data akun Anda dari sistem kami dengan menghubungi kontak kami.
            </Text>
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-2">
            <Heading as="h4" className="text-fg-default">
              Kontak Tim Privasi
            </Heading>
            <Text size="sm">
              Untuk pertanyaan, permintaan perbaikan data, atau hal lainnya terkait privasi data Anda, silakan hubungi kami melalui{" "}
              <Link href="/contact" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
                Formulir Kontak
              </Link>{" "}
              atau email ke{" "}
              <a href="mailto:halo@nureaknit.com" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
                halo@nureaknit.com
              </a>.
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}
