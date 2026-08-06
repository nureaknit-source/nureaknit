import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getDownloadsAction } from "@/actions/download";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";

export default async function DownloadsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/downloads");
  }

  const downloads = await getDownloadsAction();
  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <Section>
      <Container>
        <h1 className="font-sans text-3xl font-extrabold text-fg-default">My Downloads</h1>
        <Text className="mt-2">Patterns you've downloaded.</Text>

        {downloads.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Belum ada unduhan" message="Download pattern PDF untuk melihat riwayat di sini." />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((d) => (
              <Link
                key={d.id}
                href={`/patterns/${d.slug}`}
                className="group rounded-lg border border-border bg-bg-surface p-4 shadow-md transition hover:shadow-lg"
              >
                <h3 className="font-sans text-lg font-bold text-fg-default group-hover:text-primary">{d.title}</h3>
                <Text size="sm" className="mt-1 text-fg-muted">
                  Downloaded {new Date(d.downloadedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                </Text>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
