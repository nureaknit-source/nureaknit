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
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data && originalDoc) {
          data.revision = ((originalDoc.revision as number) ?? 1) + 1;
        }
        return data;
      },
    ],
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
      name: "reservedStock",
      type: "number",
      min: 0,
      defaultValue: 0,
      label: "Reserved Stock",
      admin: {
        position: "sidebar",
        readOnly: true,
        condition: (data) => data?.availability === "in_stock",
        description: "Dikelola otomatis oleh sistem selama checkout/payment.",
      },
    },
    {
      name: "lowStockThreshold",
      type: "number",
      min: 0,
      defaultValue: 5,
      label: "Low Stock Threshold",
      admin: {
        position: "sidebar",
        condition: (data) => data?.availability === "in_stock",
      },
    },
    {
      name: "preOrderCutoff",
      type: "date",
      label: "Pre-Order Cutoff",
      admin: {
        position: "sidebar",
        condition: (data) => data?.availability === "pre_order",
      },
    },
    {
      name: "preOrderCapacity",
      type: "number",
      min: 0,
      label: "Pre-Order Capacity (maks unit)",
      admin: {
        position: "sidebar",
        condition: (data) => data?.availability === "pre_order",
      },
    },
    {
      name: "preOrderCommitted",
      type: "number",
      min: 0,
      defaultValue: 0,
      label: "Pre-Order Committed",
      admin: {
        position: "sidebar",
        readOnly: true,
        condition: (data) => data?.availability === "pre_order",
        description: "Unit pre-order yang sudah disetujui/dibayar. Dikelola sistem.",
      },
    },
    {
      name: "perCustomerLimit",
      type: "number",
      min: 0,
      label: "Per-Customer Limit (maks unit/customer)",
      admin: {
        position: "sidebar",
        condition: (data) => data?.availability === "pre_order",
      },
    },
    {
      name: "estimatedAvailability",
      type: "text",
      label: "Estimated Availability",
      admin: {
        position: "sidebar",
        condition: (data) => data?.availability === "pre_order",
      },
    },
    {
      name: "revision",
      type: "number",
      min: 1,
      defaultValue: 1,
      label: "Revision",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Versi produk; naik tiap perubahan. Dipakai untuk snapshot order.",
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
