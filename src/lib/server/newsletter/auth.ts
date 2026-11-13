import { createHash, timingSafeEqual } from "node:crypto";

/** Constant-time bearer-token check for machine endpoints (cron, social export). */
export function bearerMatches(request: Request, secret: string | undefined, minLength = 16): boolean {
  if (!secret || secret.length < minLength) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return false;
  const a = createHash("sha256").update(token).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}
