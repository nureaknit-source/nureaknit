import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout as PayloadRootLayout } from "@payloadcms/next/layouts";
import configPromise from "@payload-config";
import { importMap } from "./admin/importMap";

export const metadata = {
  title: "Payload Admin",
  description: "Payload Admin Panel",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PayloadRootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </PayloadRootLayout>
  );
}
