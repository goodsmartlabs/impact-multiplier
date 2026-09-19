"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search } from "lucide-react";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";
import { useCartCount } from "./cart-badge";
import { BrandLogo } from "@/components/brand-logo";

export function TopNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-paper/90 backdrop-blur md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Impact Academia home">
          <BrandLogo className="w-[118px]" />
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-ink text-paper"
                    : "text-muted hover:bg-ink/5 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/cart"
            aria-label="Impact Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pink px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
