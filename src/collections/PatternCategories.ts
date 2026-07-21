import type { CollectionConfig } from "payload";

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
          ({ value, siblingData }) => {
            if (value) return value;
            const name = siblingData?.name || "";
            return name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          },
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
