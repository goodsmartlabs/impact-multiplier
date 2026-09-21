"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";

const DISCOVER_LINKS = [
  { label: "Skills", href: "/explore?type=skill" },
  { label: "Mental Models", href: "/explore?type=mental_model" },
  { label: "Productivity Systems", href: "/explore?type=productivity_system" },
  { label: "Articles", href: "/explore?type=article" },
  { label: "Tools", href: "/explore?type=tool" },
  { label: "Opportunities", href: "/explore?group=opportunities" },
] as const;

const COURSE_LINKS = [
  { label: "All Courses", href: "/academy?access=all" },
  { label: "Craft Paths", href: "/craft-paths" },
  { label: "Start with Redirection", href: "/redirection" },
  { label: "Challenges", href: "/explore?type=challenge" },
  { label: "Free Courses", href: "/academy?access=free" },
  { label: "Student Courses", href: "/academy?access=student" },
  { label: "Coming Soon", href: "/academy?access=coming_soon" },
] as const;

export function ContentMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={open ? "Close content menu" : "Open content menu"}
        aria-expanded={open}
        aria-controls="content-menu-panel"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div
          id="content-menu-panel"
          className="absolute right-0 top-12 z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)]"
        >
          <div className="border-b border-ink bg-pink-dim px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink">Explore CraftFools Academia</p>
            <p className="mt-1 text-sm font-semibold text-ink">What do you want to find?</p>
          </div>

          <MenuSection title="Discover" links={DISCOVER_LINKS} onNavigate={() => setOpen(false)} />
          <MenuSection title="Courses" links={COURSE_LINKS} onNavigate={() => setOpen(false)} bordered />
        </div>
      )}
    </div>
  );
}

function MenuSection({
  title,
  links,
  onNavigate,
  bordered = false,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
  onNavigate: () => void;
  bordered?: boolean;
}) {
  return (
    <div className={bordered ? "border-t border-line px-3 py-3" : "px-3 py-3"}>
      <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{title}</p>
      <div className="grid grid-cols-1 gap-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="group flex min-h-10 items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-blue-dim focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
          >
            {link.label}
            <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
