import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";

export const dynamic = "force-dynamic";

const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** CSV of confirmed subscribers (with consent dates). Admin only. */
export async function GET() {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const subscribers = (await getPulseStore().listSubscribers()).filter((subscriber) => subscriber.status === "active" && subscriber.verifiedAt);
  const rows = [["email", "name", "editions", "goals", "consented_at", "confirmed_at", "manage_token"], ...subscribers.map((s) => [s.email, s.name ?? "", (s.editions ?? []).join(" "), (s.goals ?? []).join(" "), s.consentAt ?? "", s.verifiedAt ?? "", s.unsubscribeToken])];
  return new NextResponse(rows.map((row) => row.map(cell).join(",")).join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=impactfools-newsletter-subscribers.csv", "Cache-Control": "no-store" },
  });
}
