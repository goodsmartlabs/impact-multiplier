import { NextResponse } from "next/server";
import { isPulseCategory } from "@/lib/pulse/categories";
import { isValidEmail } from "@/lib/pulse/validate";
import { isEditionKind } from "@/lib/newsletter/schedule";
import { GOAL_IDS } from "@/lib/newsletter/top3-questions";
import { getPulseStore, newToken } from "@/lib/server/pulse/repository";
import { emailConfigured } from "@/lib/server/newsletter/config";
import { renderVerificationEmail, sendEmail } from "@/lib/server/newsletter/email";

/**
 * Double opt-in subscription. A new address is stored as `pending` with its
 * consent time and only becomes `active` after the emailed confirmation link
 * is used. The response is the same whether or not the address already
 * exists, so this form can't be used to discover who subscribes.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true, status: "check_email" }); // honeypot

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  if (body.consent !== true) return NextResponse.json({ error: "Please tick the box to agree to receive the newsletter." }, { status: 422 });
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) || undefined : undefined;
  const interests = Array.isArray(body.interests) ? [...new Set(body.interests.filter(isPulseCategory))] : [];
  const goals = Array.isArray(body.goals) ? [...new Set(body.goals.filter((goal): goal is string => (GOAL_IDS as unknown[]).includes(goal)))] : [];
  const editionsRaw = Array.isArray(body.editions) ? [...new Set(body.editions.filter(isEditionKind))] : [];
  const editions = editionsRaw.length ? editionsRaw : ["whats_hot", "weekend_top3"];
  const source = typeof body.source === "string" ? body.source.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "site" : "site";

  const store = getPulseStore();
  if (store.kind === "none") {
    return NextResponse.json({ error: "Subscriptions are being connected. Please try again soon — nothing was saved." }, { status: 503 });
  }

  try {
    const existing = await store.findSubscriber({ email });
    const now = new Date().toISOString();
    let verifyToken: string | undefined;
    if (!existing) {
      verifyToken = newToken();
      await store.insertSubscriber({ id: "", email, name, interests, goals, editions, status: "pending", unsubscribeToken: newToken(), verifyToken, consentAt: now, source, createdAt: now });
    } else if (existing.status !== "active" || !existing.verifiedAt) {
      // Re-send a confirmation for pending or unsubscribed addresses; nothing changes until it's confirmed.
      verifyToken = existing.verifyToken ?? newToken();
      if (!existing.verifyToken) await store.patchSubscriber(existing.id, { verifyToken });
    }
    let emailSent = false;
    if (verifyToken && emailConfigured()) {
      try {
        await sendEmail({ to: email, ...renderVerificationEmail(verifyToken), idempotencyKey: `verify-${verifyToken}` });
        emailSent = true;
      } catch (error) {
        console.error("[newsletter] verification email failed", error);
      }
    }
    // Identical response for new and existing addresses.
    return NextResponse.json({ ok: true, status: "check_email", emailDelivery: emailConfigured(), emailSent: emailConfigured() ? emailSent || !verifyToken : false });
  } catch (error) {
    console.error("[newsletter] subscribe failed", error);
    return NextResponse.json({ error: "We couldn’t save your subscription. Please try again." }, { status: 502 });
  }
}
