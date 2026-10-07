"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";
import { SPRING_SOFT } from "@/lib/motion";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-6">
        {NAV_LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className="im-press relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-active"
                  aria-hidden="true"
                  transition={SPRING_SOFT}
                  className="absolute top-[5px] h-7 w-12 rounded-full bg-pink-dim"
                />
              )}
              <Icon
                className={cn("relative h-5 w-5 transition-colors", active ? "text-pink" : "text-muted")}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className={cn("relative max-w-[4rem] text-center text-[9px] leading-tight transition-colors", active ? "text-ink" : "text-muted")}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
