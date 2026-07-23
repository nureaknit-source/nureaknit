import type { Metadata } from "next";
import { Pacifico, Outfit } from "next/font/google";
import type { ServerFunctionClient } from "payload";

import { handleServerFunctions, RootLayout as PayloadRootLayout } from "@payloadcms/next/layouts";

import configPromise from "@payload-config";
import { importMap } from "./(payload)/admin/importMap";


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
        className: `${pacifico.variable} ${outfit.variable} h-full antialiased bg-bg-base`,
        suppressHydrationWarning: true,
      }}
    >
      {children}
    </PayloadRootLayout>
  );
}
