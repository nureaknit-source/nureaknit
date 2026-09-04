"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (err?: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          appearance?: "always" | "execute" | "interaction-only";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

// Test key Cloudflare Turnstile resmi yang selalu lolos dan selalu visible di localhost / domain mana pun
const CLOUDFLARE_TEST_SITE_KEY = "1x00000000000000000000AA";

export function TurnstileField() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [verified, setVerified] = useState(false);

  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    CLOUDFLARE_TEST_SITE_KEY;

  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !containerRef.current) return;
    // Hindari render ganda jika widget sudah ada
    if (widgetIdRef.current) return;

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "auto",
        appearance: "always",
        size: "normal",
        callback: (token: string) => {
          setVerified(true);
          // Set cookie agar otomatis terkirim saat form login Payload di-submit
          document.cookie = `cf_turnstile_token=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=300`;
        },
        "expired-callback": () => {
          setVerified(false);
          document.cookie =
            "cf_turnstile_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        },
        "error-callback": (err) => {
          setVerified(false);
          console.warn("[Turnstile] Error:", err);
        },
      });
    } catch (e) {
      console.error("[Turnstile] Render error:", e);
    }
  }, [siteKey]);

  useEffect(() => {
    // Reset cookie token lama
    document.cookie =
      "cf_turnstile_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    // Pastikan script dimuat ke document head
    const SCRIPT_ID = "cf-turnstile-script";
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.onload = () => {
        renderTurnstile();
      };
      document.head.appendChild(s);
    }

    // Jika window.turnstile sudah siap di browser
    if (typeof window !== "undefined" && window.turnstile) {
      renderTurnstile();
    } else {
      // Fallback polling untuk memastikan widget di-render saat script selesai dimuat
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderTurnstile();
        }
      }, 100);

      const timeout = setTimeout(() => clearInterval(interval), 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0.75rem 0 1.25rem 0",
        minHeight: "65px",
        width: "100%",
      }}
    >
      {/* Dynamic CSS injection: Menyembunyikan .login__form sampai Turnstile sukses */}
      <style>{`
        ${
          !verified
            ? `
          .login__form {
            display: none !important;
          }
        `
            : `
          .login__form {
            display: block !important;
            animation: turnstileFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes turnstileFadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
        }
      `}</style>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          renderTurnstile();
        }}
      />


      {/* Widget Turnstile Container */}
      <div
        ref={containerRef}
        style={{
          minHeight: "65px",
          minWidth: "300px",
          display: "flex",
          justifyContent: "center",
        }}
      />
    </div>
  );
}

export default TurnstileField;
