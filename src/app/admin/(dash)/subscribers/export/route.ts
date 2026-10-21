import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/admin-auth";
import { getPulseStore } from "@/lib/server/pulse/repository";

export const dynamic = "force-dynamic";

const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** CSV of active subscribers for a future email provider import. Admin only. */
export async function GET() {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const subscribers = (await getPulseStore().listSubscribers()).filter((subscriber) => subscriber.status === "active");
  const rows = [["email", "name", "interests", "joined", "manage_token"], ...subscribers.map((s) => [s.email, s.name ?? "", s.interests.join(" "), s.createdAt, s.unsubscribeToken])];
  return new NextResponse(rows.map((row) => row.map(cell).join(",")).join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=impact-brief-subscribers.csv", "Cache-Control": "no-store" },
  });
}
