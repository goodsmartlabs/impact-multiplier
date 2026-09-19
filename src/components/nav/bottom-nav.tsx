"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-5">
        {NAV_LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              <Icon
                className={cn("h-5 w-5", active ? "text-pink" : "text-muted")}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className={cn(active ? "text-ink" : "text-muted")}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
