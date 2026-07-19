import configPromise from "@payload-config";
import { REST_GET, REST_POST } from "@payloadcms/next/routes";

export const GET = REST_GET(configPromise);
export const POST = REST_POST(configPromise);
