import type { Metadata } from "next";
import { Pacifico, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToastContainer } from "@/components/ui/toast";
import "../globals.css";

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nurea Knit — Knitting & Crochet Patterns",
  description:
    "Discover knitting and crochet patterns, tutorials, and inspiration. Craft your next project with Nurea Knit.",
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${pacifico.variable} ${outfit.variable} h-full antialiased bg-bg-base`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans text-fg-default bg-bg-base">
        <Navbar />
        <main id="main-content" className="flex-1 bg-bg-base">
          {children}
        </main>
        <Footer />
        <ToastContainer />
        <Analytics />
      </body>
    </html>
  );
}
