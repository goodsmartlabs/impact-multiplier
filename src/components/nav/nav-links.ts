import type { LucideIcon } from "lucide-react";
import { Compass, GraduationCap, Home, Sparkles, User } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/my-impact", label: "My Impact", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];
