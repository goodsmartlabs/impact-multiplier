import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Single-admin protection for the Impact Pulse editorial dashboard.
 * Requires ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ chars). Without
 * both, the dashboard stays locked — there is no default password.
 */
export const ADMIN_COOKIE = "if_admin_session";
const SESSION_HOURS = 12;

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

function safeEqual(a: string, b: string): boolean {
  // Hash first so lengths always match and nothing leaks through timing.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function sign(value: string): string {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(value).digest("base64url");
}

export function createSessionValue(now = Date.now()): string {
  const expires = String(now + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionValue(value: string | undefined, now = Date.now()): boolean {
  if (!value || !adminConfigured()) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) < now) return false;
  return safeEqual(signature, sign(expires));
}

/* Basic brute-force protection (per server instance). */
const attempts = new Map<string, { count: number; until: number }>();

export function checkPassword(password: string, clientKey: string, now = Date.now()): { ok: boolean; locked?: boolean } {
  const record = attempts.get(clientKey);
  if (record && record.until > now) return { ok: false, locked: true };
  const ok = adminConfigured() && safeEqual(password, process.env.ADMIN_PASSWORD!);
  if (ok) {
    attempts.delete(clientKey);
  } else {
    const count = (record?.count ?? 0) + 1;
    attempts.set(clientKey, { count, until: count >= 5 ? now + 15 * 60 * 1000 : 0 });
  }
  return { ok };
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(ADMIN_COOKIE)?.value);
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

/** Bearer-token check for agent ingestion (PULSE_INGEST_TOKEN). */
export function verifyIngestToken(header: string | null): boolean {
  const expected = process.env.PULSE_INGEST_TOKEN;
  if (!expected || expected.length < 24 || !header?.startsWith("Bearer ")) return false;
  return safeEqual(header.slice(7).trim(), expected);
}
