import { NextResponse } from "next/server";
import { COURSES } from "@/lib/data/courses";
import { notifyOwnerOfInterest } from "@/lib/server/interest-notifications";

const LEVELS = new Set(["Just starting", "Some experience", "Confident", "Not sure yet"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const learningGoal = typeof body.learningGoal === "string" ? body.learningGoal.trim() : "";
  const skillLevel = typeof body.skillLevel === "string" && LEVELS.has(body.skillLevel) ? body.skillLevel : null;
  const validSlugs = new Set(COURSES.map((course) => course.slug));
  const courseSlugs = Array.isArray(body.courseSlugs) ? [...new Set(body.courseSlugs.filter((slug): slug is string => typeof slug === "string" && validSlugs.has(slug)))].slice(0, 20) : [];
  const sourcePage = typeof body.sourcePage === "string" ? body.sourcePage.slice(0, 500) : null;

  if (name.length < 2 || name.length > 120 || contact.length < 5 || contact.length > 200 || learningGoal.length < 10 || learningGoal.length > 3000) {
    return NextResponse.json({ error: "Please complete your name, contact detail, and learning goal." }, { status: 422 });
  }

  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return NextResponse.json({ error: "Interest saving is being connected. Please try again soon." }, { status: 503 });

  const response = await fetch(`${url}/rest/v1/interest_leads`, {
    method: "POST",
    headers: { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ learner_name: name, contact, learning_goal: learningGoal, current_skill_level: skillLevel, course_slugs: courseSlugs, source_page: sourcePage }),
    cache: "no-store",
  });
  if (!response.ok) return NextResponse.json({ error: "We could not save your interest. Please try again." }, { status: 502 });
  const rows = await response.json() as Array<{ id: string }>;
  await notifyOwnerOfInterest({ leadId: rows[0]?.id ?? "", learnerName: name, courseSlugs });
  return NextResponse.json({ ok: true });
}
