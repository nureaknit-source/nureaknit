import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout as PayloadRootLayout } from "@payloadcms/next/layouts";
import configPromise from "@payload-config";
import { importMap } from "./admin/importMap";
import { MobileNavDock } from "@/components/admin/MobileNavDock";
import "./custom-admin.css";

export const metadata = {
  title: "Nureaknit Studio Admin",
  description: "Nureaknit Studio CMS Admin Panel",
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
      <MobileNavDock />
    </PayloadRootLayout>
  );
}
