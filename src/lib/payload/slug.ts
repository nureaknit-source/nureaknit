export function generateSlug(value: string | undefined, fallback: string): string {
  if (value) return value;
  return fallback.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
