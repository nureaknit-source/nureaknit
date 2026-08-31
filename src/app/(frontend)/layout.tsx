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
      <Navbar />
      <main id="main-content" className="flex-1 bg-bg-base">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}

