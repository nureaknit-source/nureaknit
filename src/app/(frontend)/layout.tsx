import type { Metadata } from "next";
import { Pacifico, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
        {children}
        <ToastContainer />
        <Analytics />
      </body>
    </html>
  );
}
