import type { CollectionConfig } from "payload";
import { generateSlug } from "@/lib/payload/slug";

export const Patterns: CollectionConfig = {
  slug: "patterns",
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
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "content",
      type: "richText",
      label: "Content",
    },
    {
      name: "difficulty",
      type: "select",
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Easy", value: "easy" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
      defaultValue: "beginner",
      label: "Difficulty",
      admin: { position: "sidebar" },
    },
    {
      name: "yarnWeight",
      type: "select",
      options: [
        { label: "Lace (0)", value: "lace" },
        { label: "Fingering (1)", value: "fingering" },
        { label: "Sport (2)", value: "sport" },
        { label: "DK (3)", value: "dk" },
        { label: "Worsted (4)", value: "worsted" },
        { label: "Bulky (5)", value: "bulky" },
        { label: "Super Bulky (6)", value: "super-bulky" },
      ],
      label: "Yarn Weight",
      admin: { position: "sidebar" },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Featured Image",
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "media",
      label: "PDF Pattern",
      filterOptions: { mimeType: { equals: "application/pdf" } },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "pattern-categories",
      hasMany: true,
      label: "Categories",
      admin: { position: "sidebar" },
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
