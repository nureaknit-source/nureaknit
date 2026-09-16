"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Scissors,
  MessageCircle,
  Plus,
  Image as ImageIcon,
  PenTool,
  Star,
  ChevronRight,
} from "lucide-react";

export function DashboardOverview() {
  return (
    <div
      style={{
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFDFB 0%, #FAF4EE 100%)",
          border: "1px solid rgba(224, 193, 182, 0.45)",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          boxShadow: "0 4px 16px rgba(91, 65, 54, 0.04)",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              background: "rgba(174, 183, 138, 0.18)",
              color: "#6B7546",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            🧶 Nureaknit Studio
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#5B4136",
              letterSpacing: "-0.01em",
            }}
          >
            Pusat Kendali Operasional
          </h2>
          <p
            style={{
              margin: "0.25rem 0 0 0",
              fontSize: "0.875rem",
              color: "rgba(91, 65, 54, 0.72)",
            }}
          >
            Kelola pesanan, katalog produk, pola rajut, dan pesan masuk dengan cepat.
          </p>
        </div>

        {/* Live Store Quick CTA */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#E5A8A8",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(229, 168, 168, 0.35)",
            transition: "transform 0.15s ease, background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#DA9497";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#E5A8A8";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Lihat Website
          <ChevronRight size={16} />
        </a>
      </div>

      {/* 4 Core Operational Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* 1. Pesanan (Orders) */}
        <div
          style={{
            background: "#FFFDFB",
            border: "1px solid rgba(224, 193, 182, 0.45)",
            borderRadius: "14px",
            padding: "1.1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(91, 65, 54, 0.04)",
            transition: "border-color 0.15s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(229, 168, 168, 0.16)",
                color: "#D67B7B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#5B4136" }}>
                Pesanan
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(91, 65, 54, 0.6)" }}>
                Orders & Pre-Orders
              </div>
            </div>
          </div>
          <Link
            href="/admin/collections/orders"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "#F8F3ED",
              color: "#5B4136",
              fontSize: "0.8125rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span>Buka Semua Pesanan</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* 2. Produk (Products) */}
        <div
          style={{
            background: "#FFFDFB",
            border: "1px solid rgba(224, 193, 182, 0.45)",
            borderRadius: "14px",
            padding: "1.1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(91, 65, 54, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(214, 178, 138, 0.18)",
                color: "#A4774B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#5B4136" }}>
                Katalog Produk
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(91, 65, 54, 0.6)" }}>
                Rajutan Siap Kirim / Pre-Order
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <Link
              href="/admin/collections/products"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "8px",
                background: "#F8F3ED",
                color: "#5B4136",
                fontSize: "0.8125rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Daftar
            </Link>
            <Link
              href="/admin/collections/products/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 10px",
                borderRadius: "8px",
                background: "rgba(229, 168, 168, 0.2)",
                color: "#5B4136",
                fontSize: "0.8125rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
              title="Tambah Produk Baru"
            >
              <Plus size={14} />
              <span>Baru</span>
            </Link>
          </div>
        </div>

        {/* 3. Pola Rajut (Patterns) */}
        <div
          style={{
            background: "#FFFDFB",
            border: "1px solid rgba(224, 193, 182, 0.45)",
            borderRadius: "14px",
            padding: "1.1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(91, 65, 54, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(174, 183, 138, 0.2)",
                color: "#687243",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Scissors size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#5B4136" }}>
                Pola Rajut
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(91, 65, 54, 0.6)" }}>
                Digital Patterns & PDF
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <Link
              href="/admin/collections/patterns"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "8px",
                background: "#F8F3ED",
                color: "#5B4136",
                fontSize: "0.8125rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Daftar
            </Link>
            <Link
              href="/admin/collections/patterns/create"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 10px",
                borderRadius: "8px",
                background: "rgba(174, 183, 138, 0.22)",
                color: "#5B4136",
                fontSize: "0.8125rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
              title="Tambah Pola Baru"
            >
              <Plus size={14} />
              <span>Baru</span>
            </Link>
          </div>
        </div>

        {/* 4. Inquiries (Pesan & Coaching) */}
        <div
          style={{
            background: "#FFFDFB",
            border: "1px solid rgba(224, 193, 182, 0.45)",
            borderRadius: "14px",
            padding: "1.1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(91, 65, 54, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(146, 178, 198, 0.2)",
                color: "#466B7E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MessageCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#5B4136" }}>
                Pesan Masuk
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(91, 65, 54, 0.6)" }}>
                Kontak & Konsultasi
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <Link
              href="/admin/collections/contact-messages"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 6px",
                borderRadius: "8px",
                background: "#F8F3ED",
                color: "#5B4136",
                fontSize: "0.75rem",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Kontak
            </Link>
            <Link
              href="/admin/collections/coaching-requests"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 6px",
                borderRadius: "8px",
                background: "rgba(146, 178, 198, 0.18)",
                color: "#5B4136",
                fontSize: "0.75rem",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Coaching
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "12px",
          background: "#FFFDFB",
          border: "1px solid rgba(224, 193, 182, 0.35)",
        }}
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(91, 65, 54, 0.6)", marginRight: "4px" }}>
          AKSI CEPAT:
        </span>
        <Link
          href="/admin/collections/media/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "6px",
            background: "#F8F3ED",
            color: "#5B4136",
            fontSize: "0.75rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ImageIcon size={12} />
          <span>Upload Media</span>
        </Link>
        <Link
          href="/admin/collections/blog-posts/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "6px",
            background: "#F8F3ED",
            color: "#5B4136",
            fontSize: "0.75rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <PenTool size={12} />
          <span>Tulis Blog</span>
        </Link>
        <Link
          href="/admin/collections/reviews"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "6px",
            background: "#F8F3ED",
            color: "#5B4136",
            fontSize: "0.75rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Star size={12} />
          <span>Kelola Ulasan</span>
        </Link>
      </div>
    </div>
  );
}

export default DashboardOverview;
