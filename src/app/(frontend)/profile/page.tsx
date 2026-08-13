import { redirect } from "next/navigation";
import { getCurrentUser } from "./layout";
import Link from "next/link";
import { Download, ShoppingCart, Settings, LogOut } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
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
          <h1 className="font-display text-2xl text-fg-default">
            {user.name || "My Account"}
          </h1>
          <p className="mt-1 text-sm text-fg-muted">{user.email}</p>
        </div>

        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          <MenuItem
            href="/profile/downloads"
            label="My Downloads"
            icon={<Download className="h-5 w-5" />}
          />
          <MenuItem
            href="/profile/cart"
            label="My Cart"
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <MenuItem
            href="/profile/settings"
            label="Account Settings"
            icon={<Settings className="h-5 w-5" />}
          />
          <li>
            <LogoutButton className="flex w-full items-center gap-3 px-4 py-3 text-sm text-fg-secondary hover:bg-accent-subtle">
              <span className="flex-shrink-0 text-fg-muted">
                <LogOut className="h-5 w-5" />
              </span>
              <span>Logout</span>
            </LogoutButton>
          </li>
        </ul>
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
        className="flex items-center gap-3 px-4 py-3 text-fg-default hover:bg-accent-subtle"
      >
        <span className="flex-shrink-0 text-fg-muted">{icon}</span>
        <span className="text-sm">{label}</span>
      </Link>
    </li>
  );
}
