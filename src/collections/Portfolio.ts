import type { CollectionConfig } from "payload";

export const Portfolio: CollectionConfig = {
  slug: "portfolio",
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
          ({ value, siblingData }) => {
            if (value) return value;
            const title = siblingData?.title || "";
            return title
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
    {
      name: "images",
      type: "array",
      label: "Images",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Knitting", value: "knitting" },
        { label: "Crochet", value: "crochet" },
        { label: "Other", value: "other" },
      ],
      label: "Category",
      admin: { position: "sidebar" },
    },
    {
      name: "year",
      type: "number",
      label: "Year",
      admin: { position: "sidebar" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      label: "Featured",
      admin: { position: "sidebar" },
    },
  ],
};
