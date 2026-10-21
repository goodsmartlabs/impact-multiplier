import { NextResponse } from "next/server";
import { isPulseCategory } from "@/lib/pulse/categories";
import { isValidEmail } from "@/lib/pulse/validate";
import { getPulseStore, newToken } from "@/lib/server/pulse/repository";
import { emailDeliveryConfigured } from "@/lib/server/pulse/email";

/**
 * Stores a subscription. Emails are only sent once a delivery provider is
 * connected (see src/lib/server/pulse/email.ts) — the response says so.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) || undefined : undefined;
  const interests = Array.isArray(body.interests) ? [...new Set(body.interests.filter(isPulseCategory))] : [];

  const store = getPulseStore();
  if (store.kind === "none") {
    return NextResponse.json({ error: "Subscriptions are being connected. Please try again soon — nothing was saved." }, { status: 503 });
  }

  try {
    const existing = await store.findSubscriber({ email });
    if (existing) {
      // Never reveal or change an existing subscription from this public form:
      // without email confirmation we can't prove the visitor owns the address.
      // Changes go through the private manage link.
      return NextResponse.json({ ok: true, status: "already_registered", emailDelivery: emailDeliveryConfigured() });
    }
    const token = newToken();
    await store.insertSubscriber({ id: "", email, name, interests, status: "active", unsubscribeToken: token, source: "homepage", createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, status: "subscribed", manageUrl: `/pulse/brief/manage?token=${encodeURIComponent(token)}`, emailDelivery: emailDeliveryConfigured() });
  } catch (error) {
    console.error("[impact-brief] subscribe failed", error);
    return NextResponse.json({ error: "We couldn’t save your subscription. Please try again." }, { status: 502 });
  }
}
