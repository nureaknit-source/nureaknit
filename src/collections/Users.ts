import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    loginWithUsername: false,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  admin: {
    group: "System",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nama",
    },
  ],
};
