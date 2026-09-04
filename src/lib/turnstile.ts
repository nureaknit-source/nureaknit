/**
 * Helper to verify Cloudflare Turnstile token on the server.
 * Uses Cloudflare Siteverify endpoint: https://challenges.cloudflare.com/turnstile/v0/siteverify
 *
 * Sesuai dokumentasi resmi Cloudflare:
 * - Test sitekey: 1x00000000000000000000AA
 * - Test secret key: 1x0000000000000000000000000000000AA
 */

// Dummy secret key resmi Cloudflare untuk environment development/testing
export const CLOUDFLARE_TEST_SECRET_KEY =
  "1x0000000000000000000000000000000AA";

export async function verifyTurnstile(
  token: string,
  remoteip?: string,
): Promise<{ success: boolean; errorCodes?: string[] }> {
  // Always pass in automated unit/integration test environment
  if (process.env.NODE_ENV === "test") {
    return { success: true };
  }

  // Gunakan secret key dari .env jika ada, atau fallback ke Cloudflare test secret key di development
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    (process.env.NODE_ENV !== "production"
      ? CLOUDFLARE_TEST_SECRET_KEY
      : undefined);

  if (!secretKey) {
    console.error(
      "[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY wajib diset pada environment production.",
    );
    return { success: false, errorCodes: ["missing-secret-key"] };
  }

  if (!token || typeof token !== "string") {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const outcome = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    return {
      success: outcome.success === true,
      errorCodes: outcome["error-codes"],
    };
  } catch (error) {
    console.error("[Turnstile] Error verifying token with Cloudflare:", error);
    return { success: false, errorCodes: ["network-error"] };
  }
}
