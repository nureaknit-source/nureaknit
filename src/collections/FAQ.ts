import type { CollectionConfig } from "payload";

export const FAQ: CollectionConfig = {
  slug: "faq",
  admin: { group: "Content", useAsTitle: "question" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      label: "Question",
    },
    {
      name: "answer",
      type: "richText",
      required: true,
      label: "Answer",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      label: "Order",
      admin: { position: "sidebar" },
    },
  ],
};
