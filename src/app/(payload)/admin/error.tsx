"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Admin error:", error.message, "digest:", error.digest);
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      // extract URL from the redirect error and navigate
      const url = error.message.match(/\/admin\/\S+/)?.[0] || "/admin/login";
      router.push(url);
    }
  }, [error, router]);

  return null;
}
