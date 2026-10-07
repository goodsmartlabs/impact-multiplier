import type { LucideIcon } from "lucide-react";
import { Compass, GraduationCap, Home, Sparkles, User, WandSparkles } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/capacity-guide", label: "Capacity Guide", icon: WandSparkles },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/my-impact", label: "My Impact", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];
