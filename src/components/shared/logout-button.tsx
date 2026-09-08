"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import type { ReactNode } from "react";

const ConfirmDialog = dynamic(
  () => import("@/components/ui/confirm-dialog").then((mod) => mod.ConfirmDialog),
  { ssr: false }
);

export function LogoutButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <ConfirmDialog
          open={open}
          title="Logout"
          message="Kamu yakin ingin keluar?"
          confirmLabel="Logout"
          cancelLabel="Batal"
          onConfirm={handleLogout}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
