"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export function StorefrontLink() {
  return (
    <a
      href="/products"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "0.8125rem",
        fontWeight: 600,
        color: "#5B4136",
        background: "rgba(229, 168, 168, 0.18)",
        border: "1px solid rgba(229, 168, 168, 0.4)",
        textDecoration: "none",
        transition: "all 0.15s ease",
      }}
      title="Buka Website Toko (Tab Baru)"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(229, 168, 168, 0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(229, 168, 168, 0.18)";
      }}
    >
      <span>Lihat Toko</span>
      <ExternalLink size={14} strokeWidth={2.2} />
    </a>
  );
}

export default StorefrontLink;
