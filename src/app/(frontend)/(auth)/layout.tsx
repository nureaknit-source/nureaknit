import { AuthHeader } from "@/components/layout/auth-header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <AuthHeader />
      <main id="auth-content" className="flex flex-1 items-center justify-center p-4 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-border bg-bg-surface/50 py-4 text-center text-xs text-fg-muted">
        &copy; {new Date().getFullYear()} Nurea Knit. All rights reserved.
      </footer>
    </div>
  );
}
