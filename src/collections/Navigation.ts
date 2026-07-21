import type { CollectionConfig } from "payload";

export const Navigation: CollectionConfig = {
  slug: "navigation",
  admin: { group: "System", useAsTitle: "label" },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      label: "Label",
    },
    {
      name: "url",
      type: "text",
      required: true,
      label: "URL",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      label: "Order",
      admin: { position: "sidebar" },
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "navigation",
      label: "Parent Item",
      admin: { position: "sidebar" },
    },
  ],
};
