import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  admin: { group: "Inquiries", useAsTitle: "email" },
  access: {
    create: () => false,
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
      name: "subject",
      type: "text",
      required: true,
      label: "Subject",
      validate: (val: unknown) => {
        if (typeof val !== "string" || val.trim().length === 0) return "Subjek harus diisi";
        return true;
      },
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message",
      validate: (val: unknown) => {
        if (typeof val !== "string" || val.trim().length < 10) return "Pesan minimal 10 karakter";
        return true;
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Unread", value: "unread" },
        { label: "Read", value: "read" },
        { label: "Replied", value: "replied" },
      ],
      defaultValue: "unread",
      label: "Status",
      admin: { position: "sidebar" },
    },
  ],
};
