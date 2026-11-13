import { NextResponse } from "next/server";
import { getPulseStore } from "@/lib/server/pulse/repository";

/** Confirms a subscription. POST only, so link scanners that prefetch emails can't confirm on someone's behalf. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { token?: unknown };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (token.length < 20) return NextResponse.json({ error: "This confirmation link is invalid or incomplete." }, { status: 400 });
  const store = getPulseStore();
  if (store.kind === "none") return NextResponse.json({ error: "Subscriptions aren’t connected yet." }, { status: 503 });
  try {
    const subscriber = await store.findSubscriber({ verifyToken: token });
    if (!subscriber) return NextResponse.json({ error: "This confirmation link has already been used or has expired." }, { status: 404 });
    const now = new Date().toISOString();
    await store.patchSubscriber(subscriber.id, { status: "active", verifiedAt: subscriber.verifiedAt ?? now, verifyToken: undefined, unsubscribedAt: undefined });
    return NextResponse.json({ ok: true, manageUrl: `/newsletter/manage?token=${encodeURIComponent(subscriber.unsubscribeToken)}`, goals: subscriber.goals ?? [] });
  } catch (error) {
    console.error("[newsletter] verify failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
