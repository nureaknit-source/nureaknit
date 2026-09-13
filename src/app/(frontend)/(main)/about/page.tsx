import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";

export default function AboutPage() {
  return (
    <Section>
      <Container size="sm">
        <Caption>About Nurea Knit</Caption>
        <Heading as="h1" className="mt-2">
          Cerita di Balik Setiap Rajutan
        </Heading>
        <div className="mt-8 space-y-4">
          <Text>
            Selamat datang di Nurea Knit — <em>a cozy space where creativity meets craft</em>. Tempat di mana benang, jarum, dan kecintaan pada seni rajut bertemu menjadi karya-karya istimewa yang dibuat sepenuh hati.
          </Text>
          <Text>
            Setiap pola dan produk yang ada di sini dirancang dengan ketelitian tinggi, telah diuji coba, dan ditulis dengan instruksi yang mudah dipahami. Baik kamu seorang pemula yang baru pertama kali menyentuh hooks dan needles, maupun seorang <em>experienced maker</em> yang sedang mencari inspirasi project selanjutnya — <em>there is always something special for you</em>.
          </Text>
          <Text>
            Selain pola rajut, kami juga rutin membagikan tips, panduan teknik, serta ulasan bahan berkualitas melalui blog kami. Misi kami sederhana: menemani perjalanan belajarmu agar semakin percaya diri dan menikmati setiap proses merajut (<em>enjoy the process</em>).
          </Text>
          <Text>
            Terima kasih banyak sudah singgah dan mendukung produk buatan tangan. Selamat berkreasi dan <em>happy making!</em>
          </Text>
        </div>
      </Container>
    </Section>
  );
}
