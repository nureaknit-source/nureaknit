"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePasswordAction } from "@/actions/auth";
import { getProfileAction, updateProfileNameAction } from "@/actions/profile";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getProfileAction().then((profile) => {
      if (!profile.email) {
        router.push("/login?redirect=/profile/settings");
        return;
      }
      setName(profile.name);
      setEmail(profile.email);
      setFetching(false);
    });
  }, [router]);

  async function handleNameUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const result = await updateProfileNameAction(name.trim());
    setSaving(false);
    if (!result.ok) {
      if (result.error?.includes("does not exist")) {
        showToast("Nama belum tersimpan — jalankan migration dulu.", "error");
      } else {
        showToast("Gagal memperbarui nama: " + (result.error || "Unknown error"), "error");
      }
    } else {
      showToast("Nama berhasil diperbarui!", "success");
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Semua field harus diisi", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password minimal 6 karakter", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Password baru dan konfirmasi tidak cocok", "error");
      return;
    }
    setSavingPassword(true);
    const result = await updatePasswordAction(currentPassword, newPassword);
    setSavingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    if (!result.ok) {
      showToast("Gagal ganti password: " + (result.error || "Unknown error"), "error");
    } else {
      showToast("Password berhasil diperbarui!", "success");
    }
  }

  if (fetching) {
    return (
      <Section>
        <Container size="sm">
          <Heading as="h1">Account Settings</Heading>
          <div className="mt-8 space-y-6">
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container size="sm">
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-fg-muted hover:text-primary"
        >
          ← Kembali ke Profil
        </Link>

        <Heading as="h1" className="mb-2">
          Account Settings
        </Heading>
        <Text className="mb-8 text-fg-muted">
          Kelola nama akun Anda. Email tidak dapat diubah dari sini.
        </Text>

        <form onSubmit={handleNameUpdate} className="mb-12 space-y-4">
          <Input
            label="Nama"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Nama"}
          </Button>
        </form>

        <div className="mb-4">
          <Text className="text-sm font-medium text-fg-default">Email</Text>
          <Text className="mt-1 text-sm text-fg-muted">{email || "—"}</Text>
          <Text className="mt-1 text-xs text-fg-muted">
            Email cannot be changed from the profile. Contact support if needed.
          </Text>
        </div>

        <form
          onSubmit={handlePasswordUpdate}
          className="border-t border-border pt-6 space-y-4"
        >
          <Input
            label="Current Password"
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            minLength={6}
            required
          />
          <Input
            label="Confirm New Password"
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={savingPassword}>
            {savingPassword ? "Menyimpan..." : "Change Password"}
          </Button>
        </form>
      </Container>
    </Section>
  );
}
