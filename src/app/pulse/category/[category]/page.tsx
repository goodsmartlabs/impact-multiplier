import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PulseIndex } from "@/components/pulse/pulse-index";
import { getCategory, isPulseCategory, PULSE_CATEGORIES } from "@/lib/pulse/categories";
import { getPublicUpdates } from "@/lib/server/pulse/repository";

export const revalidate = 300;

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return PULSE_CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  if (!isPulseCategory(category)) return {};
  const meta = getCategory(category);
  return { title: `${meta.label} — Impact Pulse`, description: meta.blurb, alternates: { canonical: `/pulse/category/${category}` } };
}

export default async function PulseCategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  if (!isPulseCategory(category)) notFound();
  const updates = await getPublicUpdates();
  return <PulseIndex updates={updates} category={category} />;
}
