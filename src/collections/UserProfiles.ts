import type { CollectionConfig } from "payload";

export const UserProfiles: CollectionConfig = {
  slug: "user-profiles",
  admin: {
    group: "System",
    hidden: true,
    useAsTitle: "id",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "supabaseId",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Supabase User ID",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email",
    },
    {
      name: "displayName",
      type: "text",
      label: "Display Name",
    },
  ],
};
