import type { Metadata } from "next";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import type { ServerFunctionClient } from "payload";

import "@payloadcms/next/css";

import { handleServerFunctions, RootLayout as PayloadRootLayout } from "@payloadcms/next/layouts";

import configPromise from "@payload-config";
import { importMap } from "./(payload)/admin/importMap";


const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nurea Knit — Knitting & Crochet Patterns",
  description:
    "Discover knitting and crochet patterns, tutorials, and inspiration. Craft your next project with Nurea Knit.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverFunction: ServerFunctionClient = async function (args) {
    "use server";
    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  };

  return (
    <PayloadRootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{
        lang: "id",
        className: `${playfairDisplay.variable} ${inter.variable} ${caveat.variable} h-full antialiased`,
      }}
    >
      {children}
    </PayloadRootLayout>
  );
}
