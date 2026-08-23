import { sql } from "@payloadcms/db-postgres";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "System" },
  upload: {
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, crop: "center" },
      { name: "card", width: 768, height: 576, crop: "center" },
      { name: "hero", width: 1920, height: 1080, crop: "center" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "application/pdf"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        if (typeof id !== "number" && typeof id !== "string") return;
        const drizzle = req.payload.db.drizzle;
        if (!drizzle) return;
        await drizzle.execute(
          sql`DELETE FROM "products_images" WHERE "image_id" = ${id}`
        );
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
    },
  ],
};
