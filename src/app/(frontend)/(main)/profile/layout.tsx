import { redirect } from "next/navigation";
import { getProfileAction } from "@/actions/profile";

export type ProfileUser = {
  name: string | null;
  email: string | null;
};

export async function getCurrentUser(): Promise<ProfileUser | null> {
  const { name, email } = await getProfileAction();
  if (!email) return null;
  return { name: name || null, email };
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return <>{children}</>;
}
