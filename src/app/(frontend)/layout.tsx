import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToastContainer } from "@/components/ui/toast";

import "../globals.css";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-fg"
      >
        Langsung ke konten utama
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 bg-bg-base">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}
