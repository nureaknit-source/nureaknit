import type { CollectionConfig } from "payload";
import { generateSlug } from "@/lib/payload/slug";

export const Products: CollectionConfig = {
  slug: "products",
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
      name: "description",
      type: "richText",
      label: "Description",
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
      label: "Price",
      admin: { position: "sidebar" },
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
      name: "type",
      type: "select",
      options: [
        { label: "Digital", value: "digital" },
        { label: "Physical", value: "physical" },
      ],
      defaultValue: "digital",
      label: "Product Type",
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
