import type { CollectionConfig } from "payload";
import { generateSlug } from "@/lib/payload/slug";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: { group: "Content", useAsTitle: "title" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: { position: "sidebar" },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => generateSlug(value, siblingData?.title || ""),
        ],
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Content",
    },
    {
      name: "publishedAt",
      type: "date",
      defaultValue: () => new Date(),
      label: "Published At",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};
