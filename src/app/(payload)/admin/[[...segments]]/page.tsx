import configPromise from "@payload-config";
import { RootPage } from "@payloadcms/next/views";
import { generatePageMetadata } from "@payloadcms/next/views";

import { importMap } from "../importMap";

type Props = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  return generatePageMetadata({ config: configPromise, params, searchParams });
}

export default async function Page({ params, searchParams }: Props) {
  return RootPage({
    config: configPromise,
    importMap,
    params: params as Promise<{ segments: string[] }>,
    searchParams,
  });
}
