import type { CollectionConfig } from "payload";

export const REVIEWS_STATUS = ["pending", "approved", "rejected"] as const;

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    group: "Commerce",
    useAsTitle: "id",
    defaultColumns: ["product", "userName", "userEmail", "rating", "status", "createdAt"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "product",
      type: "number",
      required: true,
      index: true,
      admin: {
        description: "Product ID",
      },
    },
    {
      name: "userId",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "Supabase User ID",
      },
    },
    {
      name: "userEmail",
      type: "email",
      required: true,
      admin: {
        description: "Email user pembuat ulasan",
      },
    },
    {
      name: "userName",
      type: "text",
      admin: {
        description: "Nama display user (opsional)",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      index: true,
      admin: {
        description: "Order ID used to verify purchase",
      },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: "Rating from 1 to 5 stars",
      },
    },
    {
      name: "comment",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      index: true,
    },
  ],
};
