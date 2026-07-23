import type { CollectionConfig } from "payload";
import { generateSlug } from "@/lib/payload/slug";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
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
      name: "excerpt",
      type: "textarea",
      label: "Excerpt",
    },
    {
      name: "content",
      type: "richText",
      label: "Content",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      label: "Featured",
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      defaultValue: () => new Date(),
      label: "Published At",
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};
