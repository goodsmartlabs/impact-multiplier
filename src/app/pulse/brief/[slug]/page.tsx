import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EditionView, editionDate } from "@/components/pulse/edition-view";
import { DEMO_EDITIONS } from "@/lib/pulse/seed";
import { getPublicEdition } from "@/lib/server/pulse/repository";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return DEMO_EDITIONS.map((edition) => ({ slug: edition.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const edition = await getPublicEdition((await params).slug);
  return edition ? { title: `${edition.title} — The Impact Brief`, description: edition.intro.slice(0, 160), robots: edition.demo ? { index: false } : undefined } : {};
}

export default async function EditionPage({ params }: { params: Params }) {
  const edition = await getPublicEdition((await params).slug);
  if (!edition) notFound();
  return (
    <article className="pb-20">
      <header className="border-b border-ink bg-ink px-4 py-10 text-white md:px-6 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/pulse/brief" className="group inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />The Impact Brief</Link>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-dim">{editionDate(edition)}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-6xl">{edition.title}</h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6"><EditionView edition={edition} /></div>
    </article>
  );
}
