import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nurea Knit",
    short_name: "Nurea Knit",
    description: "Knitting & Crochet patterns, tutorials, and inspiration.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#E5A8A8",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
