import type { CollectionConfig } from "payload";

export const CoachingRequests: CollectionConfig = {
  slug: "coaching-requests",
  admin: { group: "Inquiries", useAsTitle: "name" },
  access: {
    create: () => true,
    read: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Incoming", value: "incoming" },
        { label: "Contacted", value: "contacted" },
        { label: "Completed", value: "completed" },
      ],
      defaultValue: "incoming",
      label: "Status",
      admin: { position: "sidebar" },
    },
  ],
};
