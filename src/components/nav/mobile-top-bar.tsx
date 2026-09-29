"use client";

import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { BrandLogo, BrandWordmark } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { useCartCount } from "./cart-badge";
import { ContentMenu } from "./content-menu";
import { CartCount } from "./cart-count";
import { useScrolled } from "./top-nav";

export function MobileTopBar() {
  const cartCount = useCartCount();
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between border-b border-ink px-4 py-3 transition-[background-color,box-shadow] duration-300 md:hidden",
        scrolled ? "bg-paper/95 shadow-[0_3px_0_var(--color-ink)] backdrop-blur" : "bg-pink-dim"
      )}
    >
      <Link href="/" className="group flex min-w-0 items-center gap-2" aria-label="ImpactFools Academia home">
        <BrandLogo priority className="im-mascot h-9" />
        <BrandWordmark className="text-[1.4rem]" />
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/search"
          aria-label="Search"
          className="im-press flex h-9 w-9 items-center justify-center rounded-full border border-line"
        >
          <Search className="h-4 w-4" />
        </Link>
        <ContentMenu />
        <Link
          href="/cart"
          aria-label="Impact Cart"
          className="im-press relative flex h-9 w-9 items-center justify-center rounded-full border border-line"
        >
          <ShoppingBag className="h-4 w-4" />
          <CartCount count={cartCount} />
        </Link>
      </div>
    </header>
  );
}
