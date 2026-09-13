import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Nurea Knit",
  description: "Syarat dan ketentuan penggunaan layanan, pembelian produk rajut, pola digital, dan kelas di Nurea Knit.",
};

export default function TermsPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>Legalitas &amp; Kebijakan</Caption>
        <Heading as="h1" display className="mt-2 text-3xl sm:text-4xl text-fg-default">
          Syarat &amp; Ketentuan Layanan
        </Heading>
        <Text size="sm" className="mt-2 text-fg-muted">
          Terakhir diperbarui: September 2026
        </Text>

        <div className="mt-8 space-y-8 text-fg-secondary">
          <div>
            <Text className="leading-relaxed">
              Selamat datang di <strong>Nurea Knit</strong> (<em>nureaknit.com</em>). Syarat dan Ketentuan berikut mengatur penggunaan situs web, layanan pemesanan, pembelian produk fisik rajut, pola digital (digital patterns), serta program coaching yang kami sediakan. Dengan mengakses situs web ini atau melakukan pemesanan, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan ini.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              1. Definisi &amp; Jenis Layanan
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Produk Ready Stock:</strong> Produk fisik rajutan atau perlengkapan craft yang siap dikirim setelah pembayaran terverifikasi.
              </li>
              <li>
                <strong>Produk Pre-Order (Made-to-Order):</strong> Produk fisik buatan tangan (handmade) yang baru dikerjakan setelah pesanan masuk, dengan estimasi waktu pengerjaan (lead time) sesuai keterangan di halaman produk.
              </li>
              <li>
                <strong>Pola Digital (Pattern PDF):</strong> File dokumen panduan merajut berformat digital yang dapat diunduh atau diakses setelah transaksi berhasil.
              </li>
              <li>
                <strong>Private Coaching:</strong> Sesi bimbingan belajar merajut interaktif baik secara daring maupun tatap muka terjadwal.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              2. Akun &amp; Informasi Pemesan
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Pelanggan wajib memberikan informasi yang benar, akurat, dan lengkap saat melakukan checkout (termasuk nama penerima, nomor WhatsApp/telepon aktif, serta alamat pengiriman lengkap).
              </li>
              <li>
                Nurea Knit tidak bertanggung jawab atas kegagalan pengiriman akibat kesalahan atau ketidaklengkapan alamat yang diberikan oleh pemesan.
              </li>
              <li>
                Setiap pengguna bertanggung jawab penuh untuk menjaga kerahasiaan akun dan data login masing-masing.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              3. Pemesanan, Harga &amp; Pembayaran
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Seluruh harga produk dicantumkan dalam mata uang <strong>Rupiah (IDR)</strong> dan belum termasuk biaya pengiriman (ongkos kirim), kecuali dinyatakan lain dalam penawaran khusus.
              </li>
              <li>
                Pembayaran transaksi diproses melalui saluran pembayaran resmi (termasuk QRIS dan payment gateway berizin Bank Indonesia) serta konfirmasi transfer bank resmi Nurea Knit.
              </li>
              <li>
                Terdapat batas waktu pembayaran (payment expiry) untuk setiap instruksi bayar. Jika melewati batas waktu tanpa penyelesaian pembayaran, pesanan akan otomatis dibatalkan agar ketersediaan stok dapat dialokasikan kembali.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              4. Pengiriman &amp; Ekspedisi
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Pengiriman produk fisik dilakukan menggunakan jasa ekspedisi kurir terpercaya rekanan Nurea Knit ke wilayah yang dijangkau oleh kurir di seluruh Indonesia.
              </li>
              <li>
                Nomor resi pelacakan pengiriman akan diinformasikan kepada pembeli setelah paket diserahkan kepada pihak ekspedisi.
              </li>
              <li>
                Keterlambatan waktu pengiriman yang disebabkan oleh kendala operasional pihak ekspedisi atau kondisi kahar (force majeure) berada di luar kendali langsung kami, namun tim Nurea Knit akan selalu siap membantu melakukan koordinasi penelusuran paket.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              5. Hak Kekayaan Intelektual &amp; Lisensi Pola
            </Heading>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                Seluruh konten di website ini, termasuk namun tidak terbatas pada desain pola rajut, teks, foto produk, diagram, logo, dan materi tutorial, adalah hak kekayaan intelektual milik <strong>Nurea Knit</strong> yang dilindungi oleh undang-undang hak cipta.
              </li>
              <li>
                Pembelian pola digital memberikan Anda <strong>lisensi personal (non-eksklusif)</strong> untuk penggunaan pribadi.
              </li>
              <li>
                <strong>Dilarang keras:</strong> menggandakan, membagikan gratis, menjual kembali (resell), atau mendistribusikan ulang file pola PDF Nurea Knit baik secara digital maupun fisik tanpa izin tertulis dari Nurea Knit.
              </li>
              <li>
                Anda diperkenankan menjual produk jadi yang Anda rajut sendiri menggunakan pola Nurea Knit dalam skala kecil, dengan mencantumkan kredit: <em>&ldquo;Pattern by Nurea Knit&rdquo;</em>.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              6. Kebijakan Pembatalan &amp; Pengembalian
            </Heading>
            <Text className="text-sm leading-relaxed">
              Ketentuan mengenai pembatalan pesanan, penggantian barang rusak, atau pengembalian dana diatur secara terperinci pada halaman{" "}
              <Link href="/refund" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
                Kebijakan Pengembalian (Refund Policy)
              </Link>
              , yang merupakan satu kesatuan tak terpisahkan dari Syarat dan Ketentuan ini.
            </Text>
          </div>

          <div className="space-y-3">
            <Heading as="h3" className="text-fg-default">
              7. Perubahan Ketentuan
            </Heading>
            <Text className="text-sm leading-relaxed">
              Nurea Knit berhak untuk memperbarui atau mengubah Syarat &amp; Ketentuan ini sewaktu-waktu. Perubahan akan berlaku seketika setelah diterbitkan di halaman ini. Penggunaan situs secara berkelanjutan dianggap sebagai persetujuan Anda terhadap perubahan tersebut.
            </Text>
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-2">
            <Heading as="h4" className="text-fg-default">
              Pertanyaan Seputar Ketentuan Layanan?
            </Heading>
            <Text size="sm">
              Jika Anda memiliki pertanyaan mengenai Syarat &amp; Ketentuan ini, silakan hubungi tim kami melalui halaman{" "}
              <Link href="/contact" className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
                Kontak Nurea Knit
              </Link>{" "}
              atau via email ke{" "}
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
