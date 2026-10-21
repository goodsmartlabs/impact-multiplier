import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { formatDate } from "@/lib/pulse/feed";
import { BRIEF_SECTIONS } from "@/lib/pulse/newsletter";
import type { BriefItemRef, NewsletterEdition } from "@/lib/pulse/types";

function itemHref(item: BriefItemRef) {
  return item.slug ? `/pulse/${item.slug}` : item.href;
}

/** Renders an edition for the web archive (and the admin preview). */
export function EditionView({ edition }: { edition: NewsletterEdition }) {
  return (
    <div className="space-y-8">
      {edition.demo && (
        <p className="flex items-start gap-2 rounded-2xl border border-ink bg-white p-4 text-sm"><FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-blue" />Demonstration edition built from sample content. It was not emailed to anyone.</p>
      )}
      {edition.intro && <p className="text-lg leading-relaxed text-ink/80">{edition.intro}</p>}
      {BRIEF_SECTIONS.map((section, index) => {
        const items = edition.sections[section.key] ?? [];
        if (!items.length) return null;
        return (
          <section key={section.key} aria-labelledby={`brief-${section.key}`} className={index === BRIEF_SECTIONS.length - 1 ? "rounded-3xl border border-ink bg-ink p-6 text-white" : "rounded-3xl border border-ink bg-white p-6"}>
            <p className={index === BRIEF_SECTIONS.length - 1 ? "text-[10px] font-bold uppercase tracking-[0.2em] text-pink-dim" : "text-[10px] font-bold uppercase tracking-[0.2em] text-pink"}>{String(index + 1).padStart(2, "0")} · {section.description}</p>
            <h2 id={`brief-${section.key}`} className="mt-1 font-display text-3xl font-semibold">{section.title}</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => {
                const href = itemHref(item);
                return (
                  <li key={item.title} className={index === BRIEF_SECTIONS.length - 1 ? "border-t border-white/20 pt-3 first:border-0 first:pt-0" : "border-t border-line pt-3 first:border-0 first:pt-0"}>
                    {href ? (
                      <Link href={href} className="group inline-flex items-start gap-1 font-display text-xl font-semibold leading-tight hover:underline">{item.title}<ArrowRight className="im-nudge mt-1 h-4 w-4 shrink-0" /></Link>
                    ) : <p className="font-display text-xl font-semibold leading-tight">{item.title}</p>}
                    {item.note && <p className="mt-1 text-sm opacity-80">{item.note}</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function editionDate(edition: NewsletterEdition) {
  return formatDate(edition.publishedAt ?? edition.createdAt);
}
