// ponytail: in-memory rate limiter, migrasi ke Upstash Redis saat multi-instance
const store = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60_000;

function cleanupExpiredEntries(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS && store.size < 1000) return;
  lastCleanup = now;
  for (const [key, value] of store.entries()) {
    if (now > value.resetAt) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= max;
}

export function rateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

export function getClientIp(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}
