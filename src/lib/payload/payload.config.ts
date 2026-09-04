import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { BlogPosts } from "../../collections/BlogPosts";
import { CoachingRequests } from "../../collections/CoachingRequests";
import { ContactMessages } from "../../collections/ContactMessages";
import { Downloads } from "../../collections/Downloads";
import { UserProfiles } from "../../collections/UserProfiles";
import { FAQ } from "../../collections/FAQ";
import { Media } from "../../collections/Media";
import { CartItems } from "../../collections/CartItems";
import { PatternCategories } from "../../collections/PatternCategories";
import { Patterns } from "../../collections/Patterns";
import { ProductCategories } from "../../collections/ProductCategories";
import { Products } from "../../collections/Products";
import { Users } from "../../collections/Users";
import { Orders } from "../../collections/Orders";
import { Reviews } from "../../collections/Reviews";
import { OrderItems } from "../../collections/OrderItems";
import { PaymentAttempts } from "../../collections/PaymentAttempts";
import { FulfillmentGroups } from "../../collections/FulfillmentGroups";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  sharp,
  admin: {
    user: "users",
    components: {
      beforeLogin: ["@/components/admin/TurnstileField#TurnstileField"],
    },
  },
  collections: [
    Users,
    Media,
    PatternCategories,
    Patterns,
    BlogPosts,
    ProductCategories,
    Products,
    FAQ,
    CartItems,
    CoachingRequests,
    ContactMessages,
    Downloads,
    UserProfiles,
    Orders,
    OrderItems,
    PaymentAttempts,
    FulfillmentGroups,
    Reviews,
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
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      max: process.env.NODE_ENV === "production" ? 2 : 3,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 5000,
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
