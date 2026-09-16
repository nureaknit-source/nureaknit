"use client";

import React from "react";

export function Icon() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minWidth: "18px",
        minHeight: "18px",
        borderRadius: "6px",
        background: "linear-gradient(135deg, #E5A8A8 0%, #D6B28A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(229, 168, 168, 0.25)",
      }}
      title="Nureaknit Studio"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFDFB"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>
  );
}

export default Icon;
