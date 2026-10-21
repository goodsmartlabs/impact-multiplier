import type { LucideIcon } from "lucide-react";
import { Brain, BriefcaseBusiness, GraduationCap, Newspaper, Rocket, Sparkles } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Impact Pulse is the front door; Explore, Capacity Guide and Profile live in the content menu. */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Discover", icon: Newspaper },
  { href: "/pulse/category/skills", label: "Skills", icon: Brain },
  { href: "/pulse/category/jobs", label: "Jobs & Gigs", icon: BriefcaseBusiness },
  { href: "/pulse/category/opportunities", label: "Opportunities", icon: Rocket },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/my-impact", label: "My Impact", icon: Sparkles },
];
