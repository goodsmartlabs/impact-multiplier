import { getCourseBySlug } from "@/lib/data/courses";
import { challengePath, getSkillChallenge } from "@/lib/skill-challenge";
import { getResource } from "@/lib/skill-challenge/resources";
import type { ResourceLink } from "./types";

/**
 * Everything the newsletter recommends resolves through this file, so a
 * course that is renamed, removed or still in development can never be
 * recommended as if it were available. Unknown ids return undefined and are
 * dropped (and flagged by tests).
 */

/** In-house ImpactFools / Innergency destinations that aren't courses. */
const IN_HOUSE: Record<string, ResourceLink> = {
  "build-challenge": { id: "build-challenge", title: "7-Day Build Challenge", href: "/build-challenge", provider: "ImpactFools Build Lab", access: "free", accessLabel: "Free", kind: "build-lab", inHouse: true, note: "One active build, scoped, proven and shipped in seven stages." },
  "capacity-guide": { id: "capacity-guide", title: "Capacity Guide", href: "/capacity-guide", provider: "ImpactFools", access: "free", accessLabel: "Free", kind: "path", inHouse: true, note: "Find the capacity direction that fits what you know and want." },
  "craft-paths": { id: "craft-paths", title: "Craft Paths", href: "/craft-paths", provider: "ImpactFools Academia", access: "free", accessLabel: "Free", kind: "path", inHouse: true, note: "Structured routes from first skill to paid work." },
  "impact-moves": { id: "impact-moves", title: "Impact Engine", href: "/impact-moves", provider: "ImpactFools", access: "free", accessLabel: "Free", kind: "path", inHouse: true, note: "Turn what you build into proof, money and impact." },
  "skill-challenge": { id: "skill-challenge", title: "7-Day Skill Challenge", href: "/academy/challenge", provider: "ImpactFools Academia", access: "free", accessLabel: "Free", kind: "challenge", inHouse: true, note: "Pick one of six skills and prove it in a week." },
  "pulse-jobs": { id: "pulse-jobs", title: "Impact Pulse: Jobs & Gigs", href: "/pulse/category/jobs", provider: "Impact Pulse", access: "free", accessLabel: "Free", kind: "pulse", inHouse: true, note: "Verified roles and gigs, with deadlines." },
  "pulse-opportunities": { id: "pulse-opportunities", title: "Impact Pulse: Opportunities", href: "/pulse/category/opportunities", provider: "Impact Pulse", access: "free", accessLabel: "Free", kind: "pulse", inHouse: true, note: "Grants, fellowships and programmes, source-linked." },
  "pulse-radar": { id: "pulse-radar", title: "Your Impact Radar", href: "/pulse/radar", provider: "Impact Pulse", access: "free", accessLabel: "Free", kind: "pulse", inHouse: true, note: "Personalise the feed to your goals." },
  academy: { id: "academy", title: "All ImpactFools courses", href: "/academy?access=all", provider: "ImpactFools Academia", access: "free", accessLabel: "Free & paid options", kind: "course", inHouse: true },
};

/** Official third-party homepages not already in the skill-challenge list. */
const EXTRA_EXTERNAL: Record<string, ResourceLink> = {
  gumroad: { id: "gumroad", title: "Gumroad", href: "https://gumroad.com", provider: "Gumroad", access: "external_mixed", accessLabel: "Free to start · fees on sales", kind: "tool", inHouse: false, note: "Sell a digital download without building a shop." },
  "google-docs": { id: "google-docs", title: "Google Docs", href: "https://docs.google.com", provider: "Google", access: "external_free", accessLabel: "Free", kind: "tool", inHouse: false },
  linkedin: { id: "linkedin", title: "LinkedIn", href: "https://www.linkedin.com", provider: "LinkedIn", access: "external_mixed", accessLabel: "Free · paid upgrades", kind: "tool", inHouse: false, note: "Publish proof posts and find remote roles." },
  calendly: { id: "calendly", title: "Calendly", href: "https://calendly.com", provider: "Calendly", access: "external_mixed", accessLabel: "Free plan available", kind: "tool", inHouse: false, note: "A booking link for discovery calls." },
};

function courseResource(slug: string): ResourceLink | undefined {
  const course = getCourseBySlug(slug);
  if (!course || course.visibility !== "public") return undefined;
  if (course.access === "coming_soon" || course.statusFlag !== "published") return undefined;
  const inDevelopment = course.modules.length === 0;
  const paidPrice = course.price && course.price !== "Free" ? course.price : undefined;
  const access = course.access === "free" ? "free" : paidPrice ? "paid" : "student";
  const base = access === "free" ? "Free course" : paidPrice ? `Paid · ${paidPrice}` : "Student access";
  return {
    id: `course:${slug}`,
    title: course.title,
    href: `/academy/${slug}`,
    provider: "ImpactFools Academia",
    access,
    accessLabel: inDevelopment ? `${base} · curriculum in development` : base,
    kind: "course",
    inHouse: true,
    note: course.shortDescription,
  };
}

function challengeResource(id: string): ResourceLink | undefined {
  const challenge = getSkillChallenge(id);
  if (!challenge) return undefined;
  return { id: `challenge:${id}`, title: `7-Day Skill Challenge: ${challenge.name}`, href: challengePath(challenge.id), provider: "ImpactFools Academia", access: "free", accessLabel: "Free", kind: "challenge", inHouse: true, note: challenge.tagline };
}

function externalResource(id: string): ResourceLink | undefined {
  if (EXTRA_EXTERNAL[id]) return EXTRA_EXTERNAL[id];
  const resource = getResource(id);
  if (!resource || !/^https:\/\//.test(resource.url)) return undefined;
  return { id: resource.id, title: resource.title, href: resource.url, provider: resource.provider, access: resource.kind === "docs" || resource.kind === "guide" || resource.kind === "course" ? "external_free" : "external_mixed", accessLabel: resource.kind === "docs" || resource.kind === "guide" || resource.kind === "course" ? "Free" : "Free plan / paid tiers", kind: resource.kind === "course" ? "course" : resource.kind === "tool" ? "tool" : "guide", inHouse: false, note: resource.note };
}

/**
 * Resolve a resource reference:
 *   "course:<slug>" · "challenge:<skill-id>" · "<in-house id>" · "<external id>"
 */
export function resolveResource(ref: string): ResourceLink | undefined {
  if (ref.startsWith("course:")) return courseResource(ref.slice(7));
  if (ref.startsWith("challenge:")) return challengeResource(ref.slice(10));
  return IN_HOUSE[ref] ?? externalResource(ref);
}

export function resolveResources(refs: string[]): ResourceLink[] {
  const seen = new Set<string>();
  const out: ResourceLink[] = [];
  for (const ref of refs) {
    const resource = resolveResource(ref);
    if (resource && !seen.has(resource.id)) {
      seen.add(resource.id);
      out.push(resource);
    }
  }
  return out;
}

export function isPaid(resource: ResourceLink) {
  return resource.access === "paid" || resource.access === "student";
}

