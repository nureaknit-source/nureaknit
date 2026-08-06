import type { CollectionConfig } from "payload";

export const Downloads: CollectionConfig = {
  slug: "downloads",
  admin: { group: "System", useAsTitle: "id" },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: () => false,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: "userEmail", type: "email", required: true, label: "User Email" },
    { name: "pattern", type: "relationship", relationTo: "patterns", required: true, label: "Pattern" },
    { name: "downloadedAt", type: "date", defaultValue: () => new Date().toISOString(), label: "Downloaded At", admin: { position: "sidebar", readOnly: true } },
  ],
};
