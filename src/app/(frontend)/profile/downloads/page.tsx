import { getDownloadsAction } from "@/actions/download";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";

export default async function DownloadsPage() {
  const downloads = await getDownloadsAction();

  return (
    <Section>
       <Container>
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-fg-muted hover:text-primary"
        >
          ← Kembali ke Profil
        </Link>
        <Heading as="h1">
          My Downloads
        </Heading>
        <Text className="mt-2 text-fg-muted">
          Daftar pola digital yang sudah kamu unduh. Akses dan pelajari kembali kapan saja!
        </Text>

        {downloads.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Belum Ada Unduhan"
              message="Kamu belum mengunduh pola apa pun. Yuk jelajahi koleksi pola rajut kami!"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((d) => (
              <Link
                key={`${d.slug}-${d.downloadedAt}`}
                href={`/patterns/${d.slug}`}
                className="group rounded-lg border border-border bg-bg-surface p-4 shadow-md transition hover:shadow-lg"
              >
                <h3 className="font-sans text-lg font-bold text-fg-default group-hover:text-primary">
                  {d.title}
                </h3>
                <Text size="sm" className="mt-1 text-fg-muted">
                  Diunduh pada{" "}
                  {new Date(d.downloadedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
