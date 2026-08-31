import { redirect } from "next/navigation";
import { getCurrentUser } from "./layout";
import Link from "next/link";
import { Download, ShoppingCart, Settings, LogOut, Package } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { LogoutButton } from "@/components/shared/logout-button";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return (
    <Section>
      <Container size="sm">
        <div className="mb-8">
          <Heading as="h1" display className="text-2xl sm:text-3xl">
            {user.name || "My Account"}
          </Heading>
          <Text size="sm" className="mt-1 text-fg-muted">
            {user.email}
          </Text>
        </div>

        <Card padding="none" hover={false} className="overflow-hidden">
          <ul className="flex flex-col divide-y divide-border">
            <MenuItem
              href="/profile/downloads"
              label="Pola & Unduhan (Downloads)"
              icon={<Download className="h-5 w-5" />}
            />
            <MenuItem
              href="/profile/cart"
              label="Keranjang Belanja (My Cart)"
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <MenuItem
              href="/profile/orders"
              label="Pesanan Saya (My Orders)"
              icon={<Package className="h-5 w-5" />}
            />
            <MenuItem
              href="/profile/settings"
              label="Pengaturan Akun (Settings)"
              icon={<Settings className="h-5 w-5" />}
            />
            <li>
              <LogoutButton className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-fg-secondary hover:bg-accent-subtle transition">
                <span className="flex-shrink-0 text-fg-muted">
                  <LogOut className="h-5 w-5" />
                </span>
                <span>Keluar (Logout)</span>
              </LogoutButton>
            </li>
          </ul>
        </Card>
      </Container>
    </Section>
  );
}

function MenuItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-fg-default hover:bg-accent-subtle transition"
      >
        <span className="flex-shrink-0 text-fg-muted">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

