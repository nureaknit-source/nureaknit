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
      name: "categories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
      label: "Categories",
      admin: { position: "sidebar" },
    },
    {
      name: "availability",
      type: "select",
      options: [
        { label: "In Stock", value: "in_stock" },
        { label: "Dropship", value: "dropship" },
        { label: "Pre-Order", value: "pre_order" },
        { label: "Unavailable", value: "unavailable" },
      ],
      defaultValue: "in_stock",
      label: "Availability",
      admin: { position: "sidebar" },
    },
    {
      name: "stock",
      type: "number",
      min: 0,
      label: "Stock",
      admin: {
        position: "sidebar",
        condition: (data) => data?.availability === "in_stock",
      },
    },
    {
      name: "linkedProducts",
      type: "array",
      label: "Linked Products",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          label: "Product",
        },
        {
          name: "label",
          type: "text",
          required: true,
          label: "Button Label",
          defaultValue: "View",
        },
      ],
    },
  ],
};
