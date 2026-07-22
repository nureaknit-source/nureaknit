import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { BlogPosts } from "../../collections/BlogPosts";
import { CoachingRequests } from "../../collections/CoachingRequests";
import { ContactMessages } from "../../collections/ContactMessages";
import { FAQ } from "../../collections/FAQ";
import { Media } from "../../collections/Media";
import { Navigation } from "../../collections/Navigation";
import { WishlistItems } from "../../collections/WishlistItems";
import { Pages } from "../../collections/Pages";
import { PatternCategories } from "../../collections/PatternCategories";
import { Patterns } from "../../collections/Patterns";
import { Portfolio } from "../../collections/Portfolio";
import { Products } from "../../collections/Products";
import { Users } from "../../collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
  },
  collections: [
    Users,
    Media,
    PatternCategories,
    Patterns,
    BlogPosts,
    Portfolio,
    Products,
    FAQ,
    Pages,
    Navigation,
    CoachingRequests,
    ContactMessages,
    WishlistItems,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    disable: process.env.NODE_ENV === "production",
    disablePlaygroundInProduction: process.env.NODE_ENV === "production",
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "",
        },
      },
      bucket: process.env.SUPABASE_S3_BUCKET_NAME || "",
      config: {
        forcePathStyle: true,
        endpoint: process.env.SUPABASE_S3_ENDPOINT || "",
        region: process.env.SUPABASE_S3_BUCKET_REGION || "",
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || "",
        },
      },
    }),
  ],
});
