import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import "../globals.css";
import "./frontend.css";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
