"use client";

import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { useCartCount } from "./cart-badge";
import { BrandLogo } from "@/components/brand-logo";
import { ContentMenu } from "./content-menu";

export function MobileTopBar() {
  const cartCount = useCartCount();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink bg-pink-dim px-4 py-3 md:hidden">
      <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="ImpactFools Academia home">
        <BrandLogo className="w-10 shrink-0" />
        <span className="font-playful truncate text-lg font-semibold tracking-[-0.04em]">
          <span className="text-pink">Impact</span><span className="text-blue">Fools</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/search"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
        >
          <Search className="h-4 w-4" />
        </Link>
        <ContentMenu />
        <Link
          href="/cart"
          aria-label="Impact Cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pink px-1 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
