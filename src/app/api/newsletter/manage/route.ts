import { NextResponse } from "next/server";
import { isPulseCategory } from "@/lib/pulse/categories";
import { isEditionKind } from "@/lib/newsletter/schedule";
import { GOAL_IDS } from "@/lib/newsletter/top3-questions";
import { getPulseStore } from "@/lib/server/pulse/repository";

/** Token-based preference management and unsubscribe (no login needed). */
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
      // Only a confirmed address can be re-activated from here.
      const status = subscriber.verifiedAt ? "active" : "pending";
      await store.patchSubscriber(subscriber.id, { status, unsubscribedAt: undefined });
      return NextResponse.json({ ok: true, status });
    }
    if (action === "preferences") {
      const interests = Array.isArray(body.interests) ? [...new Set(body.interests.filter(isPulseCategory))] : subscriber.interests;
      const goals = Array.isArray(body.goals) ? [...new Set(body.goals.filter((goal): goal is string => (GOAL_IDS as unknown[]).includes(goal)))] : subscriber.goals ?? [];
      const editions = Array.isArray(body.editions) ? [...new Set(body.editions.filter(isEditionKind))] : subscriber.editions ?? [];
      if (!editions.length) return NextResponse.json({ error: "Choose at least one edition, or unsubscribe instead." }, { status: 422 });
      await store.patchSubscriber(subscriber.id, { interests, goals, editions });
      return NextResponse.json({ ok: true, status: subscriber.status, interests, goals, editions });
    }
    const [user, domain] = subscriber.email.split("@");
    return NextResponse.json({
      ok: true,
      status: subscriber.status,
      verified: Boolean(subscriber.verifiedAt),
      interests: subscriber.interests,
      goals: subscriber.goals ?? [],
      editions: subscriber.editions ?? ["whats_hot", "weekend_top3"],
      email: `${user.slice(0, 2)}•••@${domain}`,
    });
  } catch (error) {
    console.error("[newsletter] manage failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
