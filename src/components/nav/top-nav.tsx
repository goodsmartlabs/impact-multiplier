"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ShoppingBag, Search } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";
import { SPRING_SOFT } from "@/lib/motion";
import { BrandLogo, BrandWordmark } from "@/components/brand-logo";
import { useCartCount } from "./cart-badge";
import { ContentMenu } from "./content-menu";
import { CartCount } from "./cart-count";

export function TopNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden px-6 py-3 transition-colors duration-500 md:block",
        scrolled ? "bg-transparent" : "bg-pink-dim"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center rounded-lg border px-5 py-2 transition-[box-shadow,border-color,background-color] duration-500",
          scrolled
            ? "border-ink bg-paper/95 shadow-[4px_4px_0_var(--color-ink)] backdrop-blur"
            : "border-ink/50 bg-paper shadow-[0_0_0_var(--color-ink)]"
        )}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="ImpactFools Academia home">
          <BrandLogo priority className="im-mascot h-11" />
          <BrandWordmark className="hidden text-[1.75rem] lg:block" />
        </Link>

        <nav className="ml-12 flex flex-1 items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {link.label}
                {/* hover underline grows from the left; the active one slides between links */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-px h-[2px] origin-left scale-x-0 rounded-full bg-ink/30 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                {active && (
                  <motion.span
                    layoutId="top-nav-active"
                    aria-hidden="true"
                    transition={SPRING_SOFT}
                    className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-pink"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="im-press group flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-ink hover:bg-blue-dim"
          >
            <Search className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
          </Link>
          <ContentMenu />
          <Link
            href="/cart"
            aria-label="Impact Cart"
            className="im-press group relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-ink hover:bg-pink-dim"
          >
            <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <CartCount count={cartCount} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Flips once the page leaves the top; state only changes at the threshold. */
export function useScrolled(threshold = 12) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > threshold));
  return scrolled;
}
