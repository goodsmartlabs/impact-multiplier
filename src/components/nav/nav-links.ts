import type { LucideIcon } from "lucide-react";
import { Brain, BriefcaseBusiness, GraduationCap, Mail, Newspaper, Rocket, Sparkles } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shorter label for tablet-width top navigation. */
  short?: string;
  /** Hidden in the tablet top nav (the logo already links here). */
  tabletHidden?: boolean;
}

/** Impact Pulse is the front door; Explore, Capacity Guide and Profile live in the content menu. */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Discover", icon: Newspaper, tabletHidden: true },
  { href: "/pulse/category/skills", label: "Skills", icon: Brain },
  { href: "/pulse/category/jobs", label: "Jobs & Gigs", short: "Jobs", icon: BriefcaseBusiness },
  { href: "/pulse/category/opportunities", label: "Opportunities", icon: Rocket },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/my-impact", label: "My Impact", icon: Sparkles },
];
