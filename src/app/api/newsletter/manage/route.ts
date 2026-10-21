import { NextResponse } from "next/server";
import { isPulseCategory } from "@/lib/pulse/categories";
import { getPulseStore } from "@/lib/server/pulse/repository";

/** Token-based preference management and one-click unsubscribe (no login needed). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const action = body.action;
  if (token.length < 20) return NextResponse.json({ error: "This link is invalid or incomplete." }, { status: 400 });

  const store = getPulseStore();
  if (store.kind === "none") return NextResponse.json({ error: "Subscriptions aren’t connected yet." }, { status: 503 });

  try {
    const subscriber = await store.findSubscriber({ token });
    if (!subscriber) return NextResponse.json({ error: "We couldn’t find this subscription." }, { status: 404 });

    if (action === "unsubscribe") {
      await store.patchSubscriber(subscriber.id, { status: "unsubscribed", unsubscribedAt: new Date().toISOString() });
      return NextResponse.json({ ok: true, status: "unsubscribed" });
    }
    if (action === "resubscribe") {
      await store.patchSubscriber(subscriber.id, { status: "active", unsubscribedAt: undefined });
      return NextResponse.json({ ok: true, status: "active" });
    }
    if (action === "preferences") {
      const interests = Array.isArray(body.interests) ? [...new Set(body.interests.filter(isPulseCategory))] : [];
      await store.patchSubscriber(subscriber.id, { interests });
      return NextResponse.json({ ok: true, status: subscriber.status, interests });
    }
    // Default: read current settings (email partly masked).
    const [user, domain] = subscriber.email.split("@");
    return NextResponse.json({ ok: true, status: subscriber.status, interests: subscriber.interests, email: `${user.slice(0, 2)}•••@${domain}` });
  } catch (error) {
    console.error("[impact-brief] manage failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
