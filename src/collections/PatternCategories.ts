import type { CollectionConfig } from "payload";
import { generateSlug } from "@/lib/payload/slug";

export const PatternCategories: CollectionConfig = {
  slug: "pattern-categories",
  admin: { group: "Content", useAsTitle: "name" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: { position: "sidebar" },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => generateSlug(value, siblingData?.name || ""),
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
  ],
};
