import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nurea Knit",
    short_name: "Nurea Knit",
    description: "Knitting & Crochet patterns, tutorials, and inspiration.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#A8B8A8",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
